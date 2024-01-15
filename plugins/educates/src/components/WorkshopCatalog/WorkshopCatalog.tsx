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
import {
  educatesApiRef,
  EducatesApiCatalogResponse,
  EducatesRequestParams,
} from '../../api';

type WorkshopGridProps = {
  userName: string;
  portal?: EducatesApiCatalogResponse;
  params: EducatesRequestParams;
};

export const WorkshopGrid = ({
  userName,
  portal,
  params,
}: WorkshopGridProps) => {
  // const classes = useStyles();
  const apiClient = useApi(educatesApiRef);

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
      await apiClient.execute(params as EducatesRequestParams).then(res => {
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
  const apiClient = useApi(educatesApiRef);
  const { entity } = useEntity();

  const { name } = useUserProfile();

  // TODO: Make this more intelligent
  const trainingPortalName = entity?.metadata.name
    ? entity.metadata.name
    : 'backstage-educates-plugin';
  const endpoint = entity?.metadata?.annotations?.[
    'training.educates.dev/endpoint'
  ]
    ? entity.metadata.annotations?.['training.educates.dev/endpoint']
    : 'none';
  const clientId = entity?.metadata?.annotations?.[
    'training.educates.dev/client-id'
  ]
    ? entity.metadata.annotations?.['training.educates.dev/client-id']
    : 'none';
  const clientSecret = entity?.metadata?.annotations?.[
    'training.educates.dev/client-secret'
  ]
    ? entity.metadata.annotations?.['training.educates.dev/client-secret']
    : 'none';
  const robotUsername = entity?.metadata?.annotations?.[
    'training.educates.dev/robot-username'
  ]
    ? entity.metadata.annotations?.['training.educates.dev/robot-username']
    : 'none';
  const robotPassword = entity?.metadata?.annotations?.[
    'training.educates.dev/robot-password'
  ]
    ? entity.metadata.annotations?.['training.educates.dev/robot-password']
    : 'none';

  const params = {
    portalName: trainingPortalName,
    url: endpoint,
    clientId: clientId,
    clientSecret: clientSecret,
    username: robotUsername,
    password: robotPassword,
  };

  const { value, loading, error } =
    useAsync(async (): Promise<EducatesApiCatalogResponse> => {
      return await apiClient.catalog(params);
    }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return (
    <>
      <WorkshopGrid portal={value} userName={name} params={params} />
    </>
  );
};
