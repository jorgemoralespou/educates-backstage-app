import React from 'react';
import {
  Progress,
  ResponseErrorPanel,
  ItemCardGrid,
  ItemCardHeader,
} from '@backstage/core-components';
import useAsync from 'react-use/lib/useAsync';
import {
  Card,
  CardContent,
  CardMedia,
  Chip,
  Typography,
} from '@material-ui/core';
import { useApi } from '@backstage/core-plugin-api';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useUserProfile } from '../useUserProfileInfo';
import { educatesCatalogApiRef } from '../../api/catalog/EducatesCatalogApi';
import { EducatesCatalogApiResponse } from '../../api/catalog/EducatesCatalogApi.model';

type WorkshopGridProps = {
  userName: string;
  portal?: EducatesCatalogApiResponse;
};

export const WorkshopGrid = ({ userName, portal }: WorkshopGridProps) => {
  // const classes = useStyles();
  const apiClient = useApi(educatesCatalogApiRef);

  /*
   * Use this mapping to create more meaningful elements for the tiles
   */
  const data = portal?.workshops.map(def => {
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
    if (portal) {
      await apiClient
        .execute(portal.trainingPortal, env, userName)
        .then(res => {
          // We save the user if it was underfined
          window.open(res, '_blank');
        });
    }
  };

  return (
    <ItemCardGrid>
      {data?.map((workshop, index) => (
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
  const { entity } = useEntity();

  const { name } = useUserProfile();

  // TODO: Make this more intelligent
  const trainingPortalName = entity?.metadata.name
    ? entity.metadata.name
    : 'backstage-educates-plugin';

  const { value, loading, error } =
    useAsync(async (): Promise<EducatesCatalogApiResponse> => {
      return await apiClient.catalog(trainingPortalName, name);
    }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return (
    <>
      <WorkshopGrid portal={value} userName={name} />
    </>
  );
};
