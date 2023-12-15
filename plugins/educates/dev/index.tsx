import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { educatesPlugin, EducatesPage } from '../src/plugin';

createDevApp()
  .registerPlugin(educatesPlugin)
  .addPage({
    element: <EducatesPage />,
    title: 'Root Page',
    path: '/educates'
  })
  .render();
