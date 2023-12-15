import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Progress,
  ResponseErrorPanel,
  ItemCardGrid,
  ItemCardHeader,
  LinkButton,
  InfoCard,
  CodeSnippet,
  BottomLink,
} from '@backstage/core-components';
import useAsync from 'react-use/lib/useAsync';
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Typography,
} from '@material-ui/core';
import { useApi } from '@backstage/core-plugin-api';
import { useUserProfile } from '../useUserProfileInfo';
import { educatesCatalogApiRef } from '../../api/EducatesCatalogApi';
import {
  EducatesCatalogApiResponse,
  Workshop,
} from '../../api/EducatesCatalogApi.model';

const useStyles = makeStyles({
  avatar: {
    height: 32,
    width: 32,
    borderRadius: '50%',
  },
});

type WorkshopGridProps = {
  userName: string;
  workshops: Workshop[];
};

export const WorkshopGrid = ({ userName, workshops }: WorkshopGridProps) => {
  // const classes = useStyles();
  const apiClient = useApi(educatesCatalogApiRef);

  /*
   * Use this mapping to create more meaningful elements for the tiles
   */
  const data = workshops.map(def => {
    return {
      // avatar: (
      //   <img
      //     src={WorkshopDefinition.picture}
      //     className={classes.avatar}
      //     alt={WorkshopDefinition.name.first}
      //   />
      // ),
      title: def.title,
      description: def.description,
      url: def.url,
      difficulty: def.difficulty?.toLowerCase(),
      tags: def.tags,
      environment: def.environment.name,
      hasSessions: def.sessions?.length > 0,
      expires: def.sessions?.[0]?.expires,
    };
  });

  const startWorkshop = async (env: string) => {
    await apiClient.execute(env, userName).then(res => {
      // We save the user if it was underfined
      window.open(res.fullUrl, '_blank');
    });
  };

  return (
    <ItemCardGrid>
      {data.map((workshop, index) => (
        <Card key={index}>
          <CardMedia>
            <ItemCardHeader title={workshop.title} />
          </CardMedia>
          <CardContent>
            {workshop.tags?.map(tag => (
              <Chip label={tag} key={tag} />
            ))}
            <Typography>{workshop.description}</Typography>
          </CardContent>
          {/* <CardActions disableSpacing>
            <LinkButton color="primary" to="/catalog">
              Go There!
            </LinkButton>
          </CardActions> */}
          {workshop.hasSessions && (
            <Typography>Started! (expires in {workshop.expires})</Typography>
          )}
          {!workshop.hasSessions && (
            <Typography
              onClick={e => {
                e.preventDefault();
                startWorkshop(workshop.environment);
              }}
            >
              Start!
            </Typography>
          )}
        </Card>
      ))}
    </ItemCardGrid>
  );
};

export const WorkshopCatalog = () => {
  const apiClient = useApi(educatesCatalogApiRef);
  const { name } = useUserProfile();

  const { value, loading, error } = useAsync(async (): Promise<Workshop[]> => {
    return (await apiClient.catalog(name)).workshops;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return (
    <>
      <WorkshopGrid workshops={value || []} userName={name} />
      {/* <InfoCard title="raw json">
        <CodeSnippet
          text={JSON.stringify(value?.json, null, 2)}
          language="json"
        />
      </InfoCard> */}
    </>
  );
};
