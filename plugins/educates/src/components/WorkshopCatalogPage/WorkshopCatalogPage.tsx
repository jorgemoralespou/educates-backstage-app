import React from 'react';
import { Grid } from '@material-ui/core';
import {
  Header,
  Page,
  Content,
  ContentHeader,
  SupportButton,
} from '@backstage/core-components';
import { WorkshopCatalog } from '../WorkshopCatalog';

export const WorkshopCatalogPage = () => (
  <Page themeId="tool">
    <Header title="Educates" subtitle="Training Platform">
      {/* <HeaderLabel label="Owner" value="Team X" />
      <HeaderLabel label="Lifecycle" value="Alpha" /> */}
    </Header>
    <Content>
      <ContentHeader title="Workshop catalog">
        <SupportButton>Open an issue here</SupportButton>
      </ContentHeader>
      <Grid container spacing={3} direction="column">
        {/* <Grid item>
          <InfoCard title="Information card">
            <Typography variant="body1">
              All content should be wrapped in a card like this.
            </Typography>
          </InfoCard>
        </Grid> */}
        <Grid item>
          <WorkshopCatalog />
        </Grid>
      </Grid>
    </Content>
  </Page>
);
