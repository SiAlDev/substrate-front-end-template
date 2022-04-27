import { Grid, Message } from 'semantic-ui-react';
import CollectionCard from './CollectionCard';

const CollectionList = ({ collections, accountPair, setStatus }) => {
  if (collections == null || collections.length === 0) {
    return (
      <Message info>
        <Message.Header>No Collection found</Message.Header>
      </Message>
    );
  }

  return (
    <Grid columns={3}>
      {collections.map((collection, i) => (
        <Grid.Column key={`collection-${i}`}>
          <CollectionCard
            collection={collection}
            accountPair={accountPair}
            setStatus={setStatus}
          />
        </Grid.Column>
      ))}
    </Grid>
  );
};

export default CollectionList;
