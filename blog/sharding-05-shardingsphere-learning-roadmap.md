---
slug: sharding-series-05-shardingsphere-learning-roadmap

title: Sharding Journey 05：从零到一，我的 ShardingSphere 摸索与进阶之路

authors: [tudouPotatoo]

tags: [学习心得, 程序员成长, 经验总结]
---

<!-- truncate -->

# 记录摸索ShardingShpere学习路线的过程

最开始，是在看12306项目文档介绍数据库表如何设计的时候，感觉看的有些一知半解，看评论区有人推荐这部分内容先去学了分库分表再回来看，因此我决定先去学分库分表。

一开始我去网上找分库分表相关的技术文章，看了一个高赞文章，感觉大概知道是啥意思，但是我记得我以前也看过分库分表的类似的文章，看的时候也能看懂，但是过一段时间就忘了，而且我感觉我虽然看的差不多，让我实际上手做，依然不会，因此我就去问了gemini这种情况应该怎么办

> You said
>
> 我在学习分库分表，看了这篇文章：https://juejin.cn/post/7085132195190276109?searchId=2026031817005606A1CFB14127ABF092CC
>
> 感觉一大问题就是，看了感觉好像懂了，过几天又忘了，怎么解决？
>
> Gemini said
>
> 这种“一看就懂，一过就忘”的状态，在学习分布式系统这种**工程实践性极强**的知识时非常普遍。原因很简单：你目前的理解还停留在“语义层面”，没有转化为“肌肉记忆”和“场景直觉”。
>
> 为了帮你彻底吃透分库分表，我建议采用**三层递进法**：
>
> 第一层：从“背结论”转向“推逻辑”
>
> 不要死记硬背分片的规则或术语，尝试通过**核心痛点**来倒推解决方案。如果再看那篇文章，尝试问自己以下问题：
>
> - **为什么要分？**（单机存储容量瓶颈、I/O 并发瓶颈、CPU 计算瓶颈）。
> - **如果不分会怎样？**（查询变慢、死锁增加、备份恢复灾难、索引失效）。
> - **分了之后有什么代价？**（分布式事务、跨节点 Join、分页难题、非分区键查询、数据扩容迁移）。
>
> 当你理解了每个方案都是为了平衡“扩展性”与“复杂度”时，你就不是在记知识点，而是在学习架构权衡。
>
> 第二层：构建“结构化地图”
>
> 分库分表的知识点很碎，你需要一个骨架把它们串起来。建议你动手画一张**思维导图**，包含以下四个象限：
>
> | 核心模块       | 关键技术点                                                   |
> | -------------- | ------------------------------------------------------------ |
> | **切分策略**   | 水平分表、垂直分库、Range 分片、Hash 取模、一致性 Hash       |
> | **中间件选择** | 客户端层（ShardingSphere-JDBC）、代理层（Mycat, ShardingSphere-Proxy） |
> | **分布式挑战** | 全局唯一 ID (Snowflake)、分布式事务 (2PC/TCC/Saga)、跨库 Join 优化 |
> | **扩容方案**   | 停机迁移、双写方案（增量+全量）、平滑扩容                    |
>
> 第三层：实践出真知（最关键）
>
> **纸上得来终觉浅。** 既然是程序员，最好的记忆方式就是写代码。我建议你花一个周末完成以下操作：
>
> 1. **快速搭建：** 使用 Spring Boot 整合 **ShardingSphere-JDBC**。
> 2. **模拟场景：** 模拟一个简单的“订单系统”，配置 2 库 4 表。
> 3. **观察行为：**
>    - 执行一个带 `user_id` 的查询，看 SQL 是如何路由到特定表的。
>    - 执行一个全表扫描的 Count 语句，看性能损耗和执行过程。
>    - 尝试写一个全局 ID 生成器。
> 4. **制造麻烦：** 尝试把两个关联表分别存在不同库里，然后去写 Join 语句，看报错信息。
>
> 给你的建议
>
> **不要试图一次性看完。** 这种长文适合作为“查漏补缺”的字典。
>
> **下一步：** 你想尝试搭建一个简单的分库分表 Demo 吗？我可以为你提供一个基于 Spring Boot 和 ShardingSphere 的基础配置模板，带你走一遍核心流程。



通过各种看文章以及各种和gemini 的对话，我大概理清了我的学习方向：

我觉得是不是应该先学一下理论：为什么要分库分表，不分会怎样，要怎么分，分了有什么后果，这些后果应该如何应对。学完理论之后要展开实践，例如自己创建一个项目，例如模拟美团外卖系统，模拟不分库分表，大数据量场景下是什么情况。改进之后，又是怎么样的性能。然后在业务场景，怎么解决事务问题等等。通过实践来真正构造一个有问题的场景，并且尝试去解决。

我学了一下理论，然后我想通过自己在本地模拟那种从单机部署mysql --》大流量下mysql如何无法支撑 --》通过分库分表如何解决 --》然后又能够支撑大流量

写到一半，感觉自己的理论知识还不足，例如不知道业界怎么做的，不知道怎么用shardingshpere...

所以我感觉问题在于，我的理论知识还是不足，就好像是一个人学了加减乘除之后就尝试去解决一个微积分问题，中间的gap还很大，是不现实的。

所以我之后做的事情是，再看了一遍之前的那个文章，这次边看边记录，然后最后自己靠自己的理解，不看资料，写给自己看，自己给自己解释，就类似于费曼学习法，保证自己是真的懂了。

懂了之后，我准备学习shardingshpere，因为我确实不知道有什么学shardingshpere比较好的资料，而且之前看过的大佬介绍的都是让直接看官方文档，因此我也是直接看官方文档学习https://shardingsphere.apache.org/document/current/en/overview/

我觉得给我的感觉是，如果让我直接看官方文档，看的很迷糊，看不太懂。

通过AI的协助能好很多，我觉得这是一种很高效的学习策略，借助AI去学习一手资料，而不是找很多二手资料去看。

大概知道shardingshpere是干啥的，shardingshpere-JDBC和shardingshpere-proxy分别是啥之后，就去学习官网的quickstart部分https://shardingsphere.apache.org/document/current/en/quick-start/ 这个网站给了一个**https://github.com/apache/shardingsphere/tree/master/examples** 这个代码库，我感觉这个代码库是学习shardingshpere非常好的一个材料。

而且它很厉害的一点是他有一个example-generator，能够按照你的需求生成各种demo代码，供你学习。

我在学这个 https://github.com/apache/shardingsphere/tree/master/examples 这个代码库的时候，其实一开始完全不知道怎么用

因为我觉得他的readme写的不太清晰，而且readme的project structure还有写错的地方，让我一度怀疑这个repository是不是很久没有维护了

不过看了一下最近commit的时间，好像还算活跃，所以我还是尝试搞懂这个怎么用的

最有效的方式对我来说就是：

直接在IDEA通过copliot问大模型：高亮部分是我的提问

> <mark>我想通过这个example项目学习shardingshpere，应该怎么做？</mark>
>
> 如何一步步操作？
> 请按照以下步骤生成并运行一个示例：
> 第一步：准备数据库
> 确保你本地启动了一个 MySQL 数据库，并且账号密码与 config.yaml 中配置的一致（默认是 root / 123456）。
> 注意：生成的示例通常会自动帮你创建数据库（如 demo_ds, demo_ds_0 等），所以你只需要保证 MySQL 运行且账号有创建库的权限即可。
> 第二步：配置生成器（可选）
> 打开 shardingsphere-jdbc-example-generator/src/main/resources/config.yaml。 如果你想生成所有类型的示例，可以保持默认。如果你只想关注 Spring Boot + MyBatis + 分库分表，可以注释掉其他的配置，减少生成的时间和文件数量。
> 第三步：运行生成器
> 找到以下主类并运行它： 类名：org.apache.shardingsphere.example.generator.ExampleGeneratorMain 文件位置：shardingsphere-jdbc-example-generator/src/main/java/org/apache/shardingsphere/example/generator/ExampleGeneratorMain.java
> 运行后，控制台会提示 Generated successful。
> 第四步：找到生成的代码
> 生成的代码位于： shardingsphere-jdbc-example-generator/target/generated-sources/shardingsphere-jdbc-sample
> 在这个目录下，你会看到根据你配置生成的各种具体项目（例如 sharding--spring-boot-starter-mybatis--standalone--local）。
> 第五步：运行生成的示例
> 你需要用 IDE（如 IntelliJ IDEA）将生成的某个子文件夹（例如 sharding--spring-boot-starter-mybatis--standalone--local）作为一个新的 Maven 项目打开，或者在当前项目中把它添加为 Maven 模块，然后运行其中的 ExampleMain 类即可看到效果。
>
> 
>
> <mark>你推荐刚接触shardingshpere的人如何配置config.yaml?</mark>
>
> 对于刚接触 ShardingSphere 的新手，我建议从最基础、最核心的功能开始配置，避免一次性生成太多复杂的代码导致混乱。
> 我已经帮你精简了 config.yaml 配置文件，保留了以下推荐组合：
> modes: standalone (单机模式)
> 不需要由 ZooKeeper 或 Etcd 管理配置，最适合本地快速启动和学习。
> transactions: local (本地事务)
> 先不涉及复杂的分布式事务（如 XA 或 Seata），专注理解 ShardingSphere 的基本行为。
> features: sharding (数据分片/分库分表)
> 这是 ShardingSphere 最核心的功能。掌握了这个再学习读写分离（readwrite-splitting）或数据加密（encrypt）会更容易。
> frameworks: spring-boot-starter-mybatis
> Spring Boot + MyBatis 是目前 Java 开发中最主流的技术栈，生成的代码示例会更接近实际工作中的项目结构。
> 如果你更习惯 JPA，也可以改用 spring-boot-starter-jpa。
>
> 接下来怎么做
> 确认数据库信息： 请检查 config.yaml 底部的 props 部分，确保 host, port, username, password 与你本地 MySQL 数据库一致。
> 生成代码： 在 shardingsphere-jdbc-example-generator 目录下，找到并运行 ExampleGeneratorMain.java 的 main 方法。 或者使用 Maven 命令（如果你的环境配置好了）。
> 查看生成的代码： 生成的项目代码会出现在： examples/shardingsphere-jdbc-example-generator/target/generated-sources/shardingsphere-jdbc-sample/ 目录下。
> 运行示例： 进入生成的项目目录，由于它是 Spring Boot 项目，直接运行其中的 Application 主类即可启动。启动后它会自动创建表并插入测试数据。
>
> 
>
> 到这里，我就已经生成好了sharding--spring-boot-starter-mybatis--standalone--local项目
>
> 一开始我直接在target那里打开项目，然后对pom.xml尝试add as maven，但是还是各种报错。
>
> 后来我用一个新的idea窗口单独打开这个项目，就不再报错了。
>
> 后续调研了一下原因：
>
> idea认为target目录是存放编译产物的地方，因此会自动忽略这个目录下的代码索引，也就是说如果直接打开target目录下的项目，是不会被maven解析的，也就会满屏报红。
>
> 因此后续如果再遇到这样的情况，就用一个新的idea窗口单独打开这些生成出来的项目。
>
> 然后我继续问AI（agent模式）
>
> 
>
> <mark>给我介绍一下这整个项目？</mark>
>
> 这是一个基于 Spring Boot + MyBatis + ShardingSphere-JDBC 的分库分表示例项目。
> 主要用于演示在 Spring Boot 环境下，如何通过 ShardingSphere-JDBC 实现数据的水平分库、水平分表以及广播表功能。
>
> 1. 项目结构概览
>    入口类: ExampleMain.java
>      标准的 Spring Boot 启动类，启动后会自动从容器中获取 ExampleService 并执行 run() 方法来演示完整的业务流程。
>      业务逻辑: ExampleService.java
>      定义了演示流程：初始化环境 -> 插入数据 -> 查询打印 -> 删除数据 -> 清理环境。
>      数据访问层 (Repository):
>      使用 MyBatis 实现，Mapper 接口位于 repository 包，XML 映射文件位于 src/main/resources/mappers。
>      操作的实体包括：Order (订单), OrderItem (订单项), Address (地址)。
>      配置文件:
>      application.properties: Spring Boot 基础配置，指定了 MyBatis 的 Mapper 位置，并将数据源配置指向了 config.yaml。
>      config.yaml: 核心配置文件，定义了 ShardingSphere 的分片规则。
> 2. 核心分片规则 (config.yaml)
>    该项目配置了 3 个数据源 (ds_0, ds_1, ds_2)，但主要使用了 ds_0 和 ds_1 进行分片演示。
>      分库策略 (Database Strategy):
>      根据 user_id 进行分库。
>      算法表达式：`ds_${user_id % 2}` (即偶数用户在 ds_0，奇数用户在 ds_1)。
>      分表策略 (Table Strategy):
>      t_order & t_order_item:
>      根据 order_id 进行分表。
>      算法表达式：`t_order_${order_id % 2}` (即单数订单号在表_1，偶数在表_0)。
>      实际数据节点配置为：`ds_$->{0..1}.t_order_$->{0..1}`，意味着数据会分布在 2 个库的 4 张表中。
>      广播表 (Broadcast Table):
>      t_address: 配置为广播表。意味着对该表的插入/更新操作会同时分发到所有数据源，查询时可从任意数据源获取。
>      主键生成:
>      使用了 SNOWFLAKE (雪花算法) 生成全局唯一的 order_id 和 order_item_id。
> 3. 运行流程 (ExampleService.run())
>    Init: 创建表 t_order, t_order_item, t_address 并清空数据。
>      Insert: 循环插入 10 条订单数据。
>      user_id 从 1 到 10，会根据奇偶性路由到不同的数据库。
>      Address 是广播表，会插入到所有定义的数据源中。
>      Print: 调用 selectAll() 查询所有数据，展示分片后的聚合查询效果。
>      Delete: 根据 order_id 删除数据。
>      Clean: 删除创建的表。
>      简单来说，这个项目是一个“麻雀虽小，五脏俱全”的 ShardingSphere-JDBC 最佳实践示例。
>
> 
>
> <mark>我想通过这个项目学习ShardingSphere-JDBC，应该怎么做？</mark>
>
> 这是一个非常标准的 ShardingSphere-JDBC 分库分表入门示例项目。通过这个项目，你可以学习到如何在 Spring Boot + MyBatis 环境下配置和使用 ShardingSphere 来实现数的分片（Sharding）。
> 这个项目演示了水平分库分表的核心功能：
> 分库：将数据分散到不同的数据库实例（demo_ds_0, demo_ds_1）。
> 分表：在同一个数据库内将数据分散到不同的表（t_order_0, t_order_1...）。
> 广播表：所有库中都存在的表，数据完全一致（t_address）。
> 分布式主键：使用雪花算法（Snowflake）生成全局唯一ID。
> 核心学习步骤
> 我建议你按照以下步骤来通过这个项目学习：
>
> 1. 理解核心配置 (config.yaml)
>    ShardingSphere-JDBC 的灵魂在于配置。请打开 src/main/resources/config.yaml，这是定义分片规则的地方。
>    数据源配置 (dataSources)：
>    定义了3个逻辑数据源：ds_0, ds_1, ds_2（看起来 ds_2在这个例子中未被使用）。
>    它们都指向本地 MySQL (localhost:3306)，但是库名不同 (demo_ds_0, demo_ds_1)。
>    分片规则 (rules)：
>    表规则 (tables)：
>    t_order 的真实节点是 `ds_$->{0..1}.t_order_$->{0..1}`，这意味着数据会被打散到 2个库 * 2个表 = 4张表中 (ds_0.t_order_0, ds_0.t_order_1, ds_1.t_order_0, ds_1.t_order_1)。
>    分片策略 (strategy)：
>    分库策略 (databaseStrategy)：使用 user_id % 2。user_id 为偶数去 ds_0，奇数去 ds_1。
>    分表策略 (tableStrategy)：使用 order_id % 2。order_id 为偶数去 _0 表，奇数去 _1 表。
>    主键生成策略 (keyGenerateStrategy)：
>    使用 SNOWFLAKE (雪花算法) 自动生成 order_id。
>    广播表 (broadcastTables)：
>    t_address 被定义为广播表。这意味着对这张表的插入/更新操作，会同时发送到所有数据源 (ds_0, ds_1)，保证每个库里这张表的数据完全一致。
> 2. 理解业务代码 (ExampleService.java)
>    打开 src/main/java/org/apache/shardingsphere/example/sharding/spring/boot/starter/mybatis/service/ExampleService.java。
>    代码并没有意识到“分库分表”的存在。它就像操作普通单库单表一样操作 OrderRepository。
>    initEnvironment(): 创建表。ShardingSphere 会自动拦截 SQL 并根据规则在所有分片库中创建真实的物理表。
>    insertData(): 插入数据。
>    循环插入10条订单，userId 从 1 到 10。
>    根据分库规则 (user_id % 2)，你会发现数据被均匀分配到了 ds_0 和 ds_1。
>    printData(): 查询数据。
>    selectAll() 会触发路由，ShardingSphere 会查询所有分片表并将结果归并后返回。
> 3. 运行并观察 (最重要的一步)
>    要运行这个项目，你需要先准备好环境。
>    前置准备：
>    确保本地安装了 MySQL，并运行在端口 3306。
>    确保 MySQL 用户名是 root，密码是 root (如果不是，请修改 config.yaml)。
>    手动在 MySQL 中创建两个空数据库：
>    CREATE DATABASE demo_ds_0;
>    CREATE DATABASE demo_ds_1;
>    (这一步必须手动做，ShardingSphere 不会自动创建数据库，只会在已有的库里建表)
>    运行项目： 运行 ExampleMain.java。
>    观察日志： 这是学习的关键！注意控制台打印的 Logic SQL (逻辑SQL) 和 Actual SQL (真实SQL)。 config.yaml 中开启了 sql-show: true，你可以看到 SQL 重写的过程。
>    预期现象：
>    当你插入 user_id=1 (奇数) 的订单时，你应该看到 SQL 被路由到了 demo_ds_1。
>    当你查询所有数据时，你应该看到日志显示 ShardingSphere 并行查询了所有4张实际表。
>
> 需要我帮你修改配置或准备运行环境吗？
> 如果你本地的 MySQL 密码不是 root，或者想修改日志级别来更清楚地看 SQL，请告诉我。
>
> 
>
> 
>
> <mark>我现在在通过shardingsphere-example学习shardingsphere的使用，我通过已经shardingsphere-jdbc-example-generator生成了sharding--spring-boot-starter-mybatis--standalone--local项目，并且已经学会了这个项目，下一步我应该继续通过shardingsphere-example学习更进阶的知识，还是通过直接通过看12306的相关代码进行学习？</mark>
>
> 恭喜你！手速很快。既然你已经跑通了 `generator` 生成的本地 Standalone（单机独立运行）项目，说明你已经掌握了 **Sharding-JDBC 的基本配置语法、数据源映射和简单的分片运行逻辑**。
>
> 站在这个路口，我的建议非常明确：**转向 12306 源码，但保留 ShardingSphere-example 作为“工具字典”。**
>
> 原因如下：
>
> 1. 为什么现在该看 12306？
>
> 你已经入职美团在即，12306 项目的架构思维与大厂后端高度一致。
>
> - **解决“真实痛点”：** 官方 Example 的数据通常是 `order_id % 2` 这种理想化模型。而 12306 会告诉你：**如果用户既想通过订单号查，又想通过用户 ID 查，该怎么分片？**（这就涉及到了“基因分片”或“索引表”的概念）。
> - **多组件协同：** 在 12306 里，ShardingSphere 不是孤立的。你会看到它如何处理 **分布式事务**，以及如何与 **Redis 缓存、RocketMQ 消息队列** 配合。
> - **工程化落地：** 12306 展示了如何将分片算法封装成自定义类，而不是简单的 `inline` 表达式，这才是生产环境的代码风格。
>
> 2. 什么时候再回来翻 Example？
>
> 当你阅读 12306 源码感到阻力时，Example 是最好的“功能验证工具”。
>
> - **遇到盲点：** 比如你在 12306 看到某个配置看不懂（例如 `SPI` 加载的自定义算法），这时候回过头去 Example 搜对应的功能模块（比如 `sharding-spring-boot-starter-mybatis-example` 里的自定义分片部分），用最简单的代码跑一下，验证你的理解。
> - **学习特定高级功能：** 如果 12306 没用到 **数据加密 (Masking)** 或 **影子库 (Shadow DB)**，而你对此感兴趣，再去 Example 里精准寻找对应的 Sample。
>
> 3. 进阶学习路线：从 12306 出发
>
> 我建议你直接打开 12306 的 **订单模块 (Order Service)**，重点攻克以下三个“进阶关卡”：
>
> 第一关：复合分片策略 (Complex Sharding)
>
> - **观察点：** 订单表是否只按一个字段分片？
> - **思考：** 乘客查票（按用户 ID）和列车员验票（按订单号）如果分片键不一致，12306 是怎么通过 ShardingSphere 解决跨片查询问题的？
>
> 第二关：分布式主键与雪花算法
>
> - **观察点：** 找到主键生成的配置。
> - **思考：** 它是如何保证在多个分库、多个微服务实例下，生成的订单 ID 绝对不重复且趋势递增的？
>
> 第三关：性能优化与改写限制
>
> - **观察点：** 观察 12306 中的分页查询。
> - **思考：** ShardingSphere 在处理 `OFFSET 10000 LIMIT 10` 这种深分页时会有什么性能损耗？12306 是如何规避这种大翻页的？
>
> 💡 你的下一步：
>
> 你可以先尝试在 12306 源码中搜索 **`sharding`** 或者 **`Shardingsphere`** 关键字，找到它的配置文件（通常是 `yaml`）。
>
> **如果你在 12306 的配置里看到某一段配置（比如一段复杂的算法类路径或者特殊的路由规则）感到困惑，直接把那段配置贴给我。** 我可以结合你刚刚学到的 Standalone 项目知识，告诉你 12306 在这里做了什么样的“高级封装”。
>
> 你是打算从 12306 的哪个模块（订单、余票、支付）开始切入？



到这里我就非常清楚应该怎么通过这个项目学习shardingshpere了

我觉得重要的一点是：这次学习，我并不是完全没困难，而是我经历过不知道东西的优先级，先学什么再学什么，不知道什么东西要学到什么程度，不知道是先做项目再学还是学完再做项目，想学一个东西不知道用什么资料，知道了用什么资料不知道用这个资料怎么用，感觉就是各种摸索摸索，然后找到一个优解。我觉得重要的是，通过这次的经历，总结一套高效的、学习新东西的方法论，当以后学新东西的时候，可以更加有方向感。

当你不知道怎么做，或者有疑问的时候，可以多跟ai对话，当然ai有的时候也不是说100%能给你有效的回答，但是多跟问他多跟他沟通，绝对要比你在互联网各种搜索，或者自己干想，效率高得多。但也不要100%听从ai，有的时候也要有自己的思考，自己的思考和ai的帮助结合在一起，是我认为最佳的ai使用方式。