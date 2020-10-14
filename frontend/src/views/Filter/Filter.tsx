import { Divider, Grid, List, ListItem, Typography } from '@material-ui/core';
import Button from 'components/Button';
import LoadingScreen from 'components/LoadingScreen';
import Paper from 'components/Paper';
import TextField from 'components/TextField';
import { useSetOriginalGroups, useSetParticipants } from 'context/EventContext';
import useSnackbar from 'context/SnakbarContext';
import { Failure, Initial, Loading } from 'lemons';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import useWebSocket from 'react-use-websocket';
import { generateGroups } from 'utils/axios';
import { IFilterData, IParticipants } from 'utils/types';
import Table from 'views/Filter/components/Table';

export type FilterProps = { title: string };

type findParticipantType = { id: string };

function Filter({ title }: FilterProps) {
  const [participants] = useSetParticipants();
  const [, setOriginGroups] = useSetOriginalGroups();
  const [joinedParticipants, setJoinedParticipants] = React.useState<IParticipants[]>([]);

  const { errors, handleSubmit, control, getValues } = useForm();

  const history = useHistory();
  const { eventId }: { eventId: string } = useParams();
  const SocketURL = `${process.env.REACT_APP_SOCKET_URL}/connect/${eventId}?access_token=token`;
  const { lastMessage } = useWebSocket(SocketURL);
  // eslint-disable-next-line new-cap
  const [submitFormLazy, setSubmitFormLazy] = React.useState(Initial());
  const { showSnackbar } = useSnackbar();

  const [uniqueGroups] = React.useState(Array.from(new Set(participants.map((participant: IParticipants) => participant.group))));

  React.useEffect(() => {
    const isParticipantRegistered = joinedParticipants.find(({ id }: findParticipantType) => id === lastMessage?.data);
    if (!isParticipantRegistered) {
      const participant = participants.find(({ id }: findParticipantType) => id === lastMessage?.data);
      if (participant) {
        setJoinedParticipants([...joinedParticipants, participant]);
      }
    }
    // eslint-disable-next-line
  }, [lastMessage]);
  // eslint-disable-next-line
  const onSubmit = (formData: any) => {
    const filters = [{ name: undefined, minimum: inputNumberParser(formData.minimumPerGroup), maximum: inputNumberParser(formData.maximumPerGroup) }];
    // eslint-disable-next-line
    uniqueGroups.forEach((group) =>
      filters.push({ name: group as any, minimum: inputNumberParser(formData[`${group}_min`]), maximum: inputNumberParser(formData[`${group}_min`]) }),
    );
    const data: IFilterData = {
      participants: joinedParticipants,
      filters: filters,
    };
    // eslint-disable-next-line new-cap
    setSubmitFormLazy(Loading());
    generateGroups(data)
      .then((response) => {
        setOriginGroups(response.data);
        showSnackbar('success', 'Gruppene er blitt generert');
        history.push(`/${eventId}/present`);
      })
      .catch((err) => {
        // eslint-disable-next-line
        console.error(err);
        showSnackbar('error', err.response?.statusText);
        // eslint-disable-next-line new-cap
        setSubmitFormLazy(Failure(err.response?.statusText));
      });
  };

  const inputNumberParser = (value: string) => {
    return value === '' ? 0 : Number(value);
  };

  return (
    <>
      {submitFormLazy.dispatch(
        () => null,
        () => (
          <LoadingScreen message={'Genererer grupper...'} />
        ),
        (err) => (
          <div>
            <Typography color='error' variant='h1'>
              En feil har skjedd: {err}
            </Typography>
          </div>
        ),
        () => null,
      )}
      <Typography gutterBottom variant='h4'>
        {title}
      </Typography>
      <Grid container direction={'row-reverse'} justify={'space-between'} spacing={4}>
        <Grid container direction={'column'} item md={4} spacing={4}>
          <Grid item>
            <Paper>
              <Grid container item spacing={4}>
                <Grid container item justify='center' spacing={2} xs={12}>
                  <Grid item>
                    <Typography align={'right'} color='secondary'>
                      {joinedParticipants?.length + '/' + participants?.length}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography>har blitt med</Typography>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Button fullWidth label='Generer grupper' onClick={handleSubmit(onSubmit)} type='submit' />
                </Grid>
                <Grid item xs={12}>
                  <Button fullWidth label='Gå tilbake' link onClick={() => history.push(`/${eventId}`)} />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item>
            <Paper>
              <Typography gutterBottom variant='h5'>
                Filter
              </Typography>
              <List disablePadding>
                <form autoComplete='off' noValidate>
                  <FilterItems
                    control={control}
                    error={errors.minimumPerGroup}
                    id='filter_minimumPerGroup'
                    label='Min per gruppe'
                    name='minimumPerGroup'
                    required='Påkrevd'
                    rules={{
                      min: {
                        value: 1,
                        message: 'Må være større enn 0',
                      },
                    }}
                  />
                  <FilterItems
                    control={control}
                    error={errors.maximumPerGroup}
                    id='filter_maximumPerGroup'
                    label='Max per gruppe'
                    name='maximumPerGroup'
                    required='Påkrevd'
                    rules={{
                      min: {
                        value: 1,
                        message: 'Må være større enn 0',
                      },
                      validate: (value: number) => value >= getValues('minimumPerGroup') || 'Max må være større eller lik Min',
                    }}
                  />
                  {
                    // eslint-disable-next-line
                    uniqueGroups.map((group: any, index: number) => (
                      <Filters control={control} errors={errors} getValues={getValues} key={index} label={group} />
                    ))
                  }
                </form>
              </List>
            </Paper>
          </Grid>
        </Grid>
        <Grid item md={8} xs={12}>
          <Table participantList={joinedParticipants} />
        </Grid>
      </Grid>
    </>
  );
}

type IFilterItems = {
  id: string;
  name: string;
  label: string;
  type?: string;
  required?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rules?: any;
};

const FilterItems = ({ id, name, label, type = 'number', control, error, required = undefined, rules }: IFilterItems) => {
  return (
    <ListItem>
      <TextField control={control} defaultValue={'1'} error={error} fullWidth id={id} label={label} name={name} required={required} rules={rules} type={type} />
    </ListItem>
  );
};
type IFilter = {
  control: any;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getValues: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any;
};
// eslint-disable-next-line
const Filters = ({ control, label, getValues, errors }: IFilter) => {
  return (
    <>
      <Divider />
      <ListItem>
        <Typography variant='body1'>{label}</Typography>
      </ListItem>
      <ListItem>
        <TextField
          control={control}
          defaultValue={'0'}
          error={errors[`${label}_min`]}
          fullWidth
          id={`${label}_min`}
          label={'Min'}
          name={`${label}_min`}
          rules={{
            min: {
              value: 0,
              message: 'Må være større eller lik 0',
            },
          }}
          type={'number'}
        />
      </ListItem>
      <ListItem>
        <TextField
          control={control}
          defaultValue={'0'}
          error={errors[`${label}_max`]}
          fullWidth
          id={`${label}_max`}
          label={'Max'}
          name={`${label}_max`}
          rules={{
            min: {
              value: 0,
              message: 'Må være større eller lik 0',
            },
            validate: (value: number) => (value !== 0 && value >= getValues(`${label}_min`)) || 'Max må være større eller lik Min',
          }}
          type={'number'}
        />
      </ListItem>
    </>
  );
};

export default Filter;
