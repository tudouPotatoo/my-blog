import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/my-blog/blog',
    component: ComponentCreator('/my-blog/blog', '534'),
    exact: true
  },
  {
    path: '/my-blog/blog/archive',
    component: ComponentCreator('/my-blog/blog/archive', '956'),
    exact: true
  },
  {
    path: '/my-blog/blog/authors',
    component: ComponentCreator('/my-blog/blog/authors', 'b16'),
    exact: true
  },
  {
    path: '/my-blog/blog/authors/all-sebastien-lorber-articles',
    component: ComponentCreator('/my-blog/blog/authors/all-sebastien-lorber-articles', '159'),
    exact: true
  },
  {
    path: '/my-blog/blog/authors/yangshun',
    component: ComponentCreator('/my-blog/blog/authors/yangshun', '97b'),
    exact: true
  },
  {
    path: '/my-blog/blog/first-blog-post',
    component: ComponentCreator('/my-blog/blog/first-blog-post', '500'),
    exact: true
  },
  {
    path: '/my-blog/blog/long-blog-post',
    component: ComponentCreator('/my-blog/blog/long-blog-post', 'e71'),
    exact: true
  },
  {
    path: '/my-blog/blog/mdx-blog-post',
    component: ComponentCreator('/my-blog/blog/mdx-blog-post', '953'),
    exact: true
  },
  {
    path: '/my-blog/blog/tags',
    component: ComponentCreator('/my-blog/blog/tags', 'e9a'),
    exact: true
  },
  {
    path: '/my-blog/blog/tags/docusaurus',
    component: ComponentCreator('/my-blog/blog/tags/docusaurus', '3a4'),
    exact: true
  },
  {
    path: '/my-blog/blog/tags/facebook',
    component: ComponentCreator('/my-blog/blog/tags/facebook', '9bb'),
    exact: true
  },
  {
    path: '/my-blog/blog/tags/hello',
    component: ComponentCreator('/my-blog/blog/tags/hello', 'ef2'),
    exact: true
  },
  {
    path: '/my-blog/blog/tags/hola',
    component: ComponentCreator('/my-blog/blog/tags/hola', 'c7f'),
    exact: true
  },
  {
    path: '/my-blog/blog/welcome',
    component: ComponentCreator('/my-blog/blog/welcome', '3d6'),
    exact: true
  },
  {
    path: '/my-blog/markdown-page',
    component: ComponentCreator('/my-blog/markdown-page', '4dd'),
    exact: true
  },
  {
    path: '/my-blog/docs',
    component: ComponentCreator('/my-blog/docs', '8b4'),
    routes: [
      {
        path: '/my-blog/docs',
        component: ComponentCreator('/my-blog/docs', '76e'),
        routes: [
          {
            path: '/my-blog/docs',
            component: ComponentCreator('/my-blog/docs', 'adc'),
            routes: [
              {
                path: '/my-blog/docs/category/tutorial---basics',
                component: ComponentCreator('/my-blog/docs/category/tutorial---basics', '40e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/my-blog/docs/category/tutorial---extras',
                component: ComponentCreator('/my-blog/docs/category/tutorial---extras', '39d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/my-blog/docs/intro',
                component: ComponentCreator('/my-blog/docs/intro', 'a28'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/my-blog/docs/tutorial-basics/congratulations',
                component: ComponentCreator('/my-blog/docs/tutorial-basics/congratulations', '529'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/my-blog/docs/tutorial-basics/create-a-blog-post',
                component: ComponentCreator('/my-blog/docs/tutorial-basics/create-a-blog-post', 'dda'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/my-blog/docs/tutorial-basics/create-a-document',
                component: ComponentCreator('/my-blog/docs/tutorial-basics/create-a-document', '7e3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/my-blog/docs/tutorial-basics/create-a-page',
                component: ComponentCreator('/my-blog/docs/tutorial-basics/create-a-page', 'b5d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/my-blog/docs/tutorial-basics/deploy-your-site',
                component: ComponentCreator('/my-blog/docs/tutorial-basics/deploy-your-site', '965'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/my-blog/docs/tutorial-basics/markdown-features',
                component: ComponentCreator('/my-blog/docs/tutorial-basics/markdown-features', 'a1d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/my-blog/docs/tutorial-extras/manage-docs-versions',
                component: ComponentCreator('/my-blog/docs/tutorial-extras/manage-docs-versions', '212'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/my-blog/docs/tutorial-extras/translate-your-site',
                component: ComponentCreator('/my-blog/docs/tutorial-extras/translate-your-site', 'f2c'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/my-blog/',
    component: ComponentCreator('/my-blog/', '4c4'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
