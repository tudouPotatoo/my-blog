---
slug: cache-penetration
title: 12306 核心实战：解决缓存穿透问题
authors: [tudouPotatoo]
tags: [Redis, 布隆过滤器, 高并发, 缓存穿透, 12306项目]

---

自上而下学习，通过12306的用户注册场景来学习如何防止缓存穿透
<!-- truncate -->

# 12306用户注册如何防止缓存穿透

## 1. 什么是缓存穿透

一般来说，应用程序在查询数据的时候，不是直接查询DB，而是先查询缓存，缓存中不存在才会去查询DB。

缓存穿透指的是大量读请求读的都是DB中不存在的数据，则查缓存一定无法命中，这些请求会全部打到DB，导致DB负载过大，甚至崩溃。

![缓存穿透](12306-CachePenetration.assets/bfde24d94dcc4370b4837f9ed42fe5c9~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

## 2. 用户注册穿透场景

用户注册场景为什么会出现缓存穿透问题？

注册流程如下：

1. 用户填写username
2. 前端自动将username传给后端以便于后端检查username是否已经被用过
3. 后端先查询redis，如果redis中不存在，则查询DB
4. 如果DB中也不存在，则说明该username未被注册过，可以使用

![注册流程.drawio](12306-CachePenetration.assets/注册流程.drawio.svg)

在高并发场景下，大量用户同时以新的username注册，就会出现缓存穿透问题。

![注册场景缓存穿透.drawio](12306-CachePenetration.assets/注册场景缓存穿透.drawio.svg)



## 3. 常见的解决方案及存在的问题

解决缓存穿透的常见解决方案有哪些？

1. 存Null值。

   如果查询的key在Redis和DB都不存在，则在Redis中存该key，并将值设为Null。为了避免存储过多Null值占用内存，设置较短的过期时间60s。

2. 使用布隆过滤器。

   将所有username存入布隆过滤器，判断username是否存在时使用布隆过滤器，如果布隆过滤器判定为不存在则一定不存在，避免查询DB。

3. 使用Redis Set。

   用Redis Set存储所有注册过的username，则所有查询可以在Redis层完成，不需要走到DB层。

4. 分布式锁。

   高并发场景下，使用分布式锁，保证同一时刻只有一个线程能够访问DB。



上述方案存在的问题：

1. 存Null值。

   问题一：在大量用户同时以未注册的username进行注册的高并发场景，依然会对DB造成巨大的负载。

   问题二：假设用户1输入了username为tudou，最后并未使用tudou作为用户名。其它用户在60s之内也无法使用tudou作为用户名，影响用户体验。

   问题二这是为啥？

   当用户1输入了username为tudou，查询Redis和MySQL都不存在，则会在Redis存key为tudou，value为null。

   当用户2输入tudou，查Redis查到该数据，则会认为该username已被占用。

   那如果是下面这种方式呢？用户2输入tudou，查到key的value为null，则认为该username未被占用，则可以进行注册。

   这样会存在的问题是：

   1. 如果大量用户2同时输入tudou，都查到key的value为null，都认为username未被占用，则他们都进行注册，最后这些所有的用户2都会走到DB，在真正写入数据之前还需要检查一下DB中该username是否被用过。这样就导致在redis层的检查意义不大，因为到DB层要再次校验。以及这些请求全部都被打到DB，所以也没能达到避免缓存穿透的问题。
   2. 会出现用户点击注册按钮之前，显示该用户名可用。点击注册按钮，提交注册请求之后，显示用户名已被占用，注册失败的情况。造成不好的用户体验。

   所以这里的Redis存null值表达的究竟是什么含义？

   虽然是null值，表示当前没有任何人在用。但是为了避免出现缓存穿透，该key不允许任何其它人使用，表示暂时锁定了这个key的状态。**技术含义：** “这个 Key 我已经查过了，DB 里现在没有，**为了保护 DB，接下来的 60 秒内谁也别想再来查这个 Key**。

   其实问题一已经足够让存Null值这个方案被pass了，问题2是进一步讨论该方案的问题。

2. 使用布隆过滤器。

   问题一：假设用户1使用tudou作为用户名，在用户1注销之后，理论上其它用户可以再次以tudou作为用户名注册。但是由于布隆过滤器并不支持删除操作，用户1注销之后无法将`tudou`从布隆过滤器删除，因此布隆过滤器会显示存在，因此用户注销之后其用户名依然不可用。

3. 使用Redis Set。

   问题一：12306是一个十亿量级的产品，如果将十亿用户的username都存在Redis Set中，会占用大量内存，成本高昂。

   问题二：十亿用户的username全部存在一个key里面会造成大key问题，因此还涉及分片问题，增加了问题的复杂度。

4. 分布式锁。

   问题一：用户注册高峰期同一时刻仅允许一个线程访问DB，会导致其它用户等待时长很长甚至请求超时，导致用户体验很差。

## 4. 12306用户注册如何解决缓存穿透

布隆过滤器是一个很好的方案，它占用内存小，查询速度快，唯一的问题是它仅支持添加不支持删除操作。如果我们在布隆过滤器之后再加一层缓存，专门存储删除了的username，则我们可以在查询布隆过滤器之后查询一次这个缓存，就解决了布隆过滤器不支持删除的问题，具体流程如下图：

![12306用户注册解决缓存穿透方案.drawio](12306-CachePenetration.assets/12306用户注册解决缓存穿透方案.drawio-6838457.svg)

通过虚线可以看出来：对于误判的情况（username实际不存在，误判为存在），最后也被判定为不可用。

这种没有银弹，其实并不太影响用户体验，用户看`tudou`不可用，换成`tudou_0123aaa`即可。



该方案存在的问题：

1. 需要查询两次，先查布隆过滤器，再查Redis Set，查询性能消耗增加。

2. 增加存储开销，在布隆过滤器的基础上，增加了Redis Set的存储开销。

3. 如果有恶意用户频繁用新的username注册、注销、注册、注销，会导致Redis Set的结构逐渐变庞大，造成大Key问题，增加存储和查询的开销。

   解决方案：

   3.1 根据用户的证件号，记录该用户的注销次数，如果达到上限5次，则将该名用户拉黑，不再允许注册。

   3.2 提前避免出现大key问题。将Redis Set分片，根据username的hashcode取模，将数据分散在1024个分片中。

## 5. 代码逻辑

### 5.1 判断用户名是否可用方法

```java
public Boolean isUsernameAvailable(String username) {
    // 1. 布隆过滤器判断用户名是否存在
    boolean hasUsername = userRegisterCachePenetrationBloomFilter.contains(username);
    // 2. 用户名在布隆过滤器中存在
    if (hasUsername) {
        StringRedisTemplate instance = (StringRedisTemplate) distributedCache.getInstance();
        // 3. 检查是否在Redis Set中存在，存在则说明用户名已注销，可用；不存在则说明该用户名正在被使用，不可用。
        return instance.opsForSet().isMember(USER_REGISTER_REUSE_SHARDING + hashShardingIdx(username), username);
    }
    // 4. 用户名在布隆过滤器中不存在，说明用户名未被注册过，可用。
    return true;
}
```



### 5.2 注册方法

注册的时候会有一个注册责任链，在责任链中有多个handler，其中一个handler专门用于校验username的可用性。该handler的handler方法就是调用上述的`isUsernameAvailable`方法。

注册方法：

```java
public UserRegisterRespDTO register(UserRegisterReqDTO requestParam) {
    // 责任链逻辑
    abstractChainContext.handler(UserChainMarkEnum.USER_REGISTER_FILTER.name(), requestParam);
    // 注册逻辑
    // ...
}
```

注册方法使用的责任链handler接口

```java
/**
 * 用户注册责任链过滤器
 */
public interface UserRegisterCreateChainFilter<T extends UserRegisterReqDTO> extends AbstractChainHandler<UserRegisterReqDTO> {

    @Override
    default String mark() {
        return UserChainMarkEnum.USER_REGISTER_FILTER.name();
    }
}
```

注册责任链其中一个handler：检验用户名是否可用

```java
/**
 * 用户注册用户名可用性检验
 */
@Component
@RequiredArgsConstructor
public final class UserRegisterUsernameAvailableChainHandler implements UserRegisterCreateChainFilter<UserRegisterReqDTO> {

    private final UserLoginService userLoginService;

    @Override
    public void handler(UserRegisterReqDTO requestParam) {
      	// 调用isUsernameAvailable校验用户名是否可用
        if (!userLoginService.isUsernameAvailable(requestParam.getUsername())) {
            throw new ClientException(UserRegisterErrorCodeEnum.USERNAME_NOT_AVAILABLE);
        }
    }

    @Override
    public int getOrder() {
        return 1;
    }
}
```



### 5.3 注销方法

```java
public void deletion(UserDeletionReqDTO requestParam) {
  // 删除用户数据...
  // 用户名回收利用 将用户名加入Redis Set中
  StringRedisTemplate instance = (StringRedisTemplate) distributedCache.getInstance();
  instance.opsForSet().add(USER_REGISTER_REUSE_SHARDING + hashShardingIdx(username), username);
}
```



## 6. 相关内容

* 布隆过滤器介绍：https://tudoupotatoo.github.io/my-blog/blog/bloom-filter-deep-dive
