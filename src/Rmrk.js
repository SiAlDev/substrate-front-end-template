import React, { useEffect, useState } from 'react';
import { Button, Grid, Modal, Form } from 'semantic-ui-react';

import { useSubstrate } from './substrate-lib';
import CollectionCards from './CollectionCards';
import { CreateCollectionButton } from './rmrk-function-calls/CollectionButtons';

const parseCollection = (
  collectionId,
  { createdAtHash, issuer, metadata, max, symbol, nftsCount }
) => ({
  collectionId: collectionId,
  createdAtHash: createdAtHash.toJSON(),
  issuer: issuer.toJSON(),
  metadata: metadata.toJSON(),
  max: max.toJSON(),
  symbol: String.fromCharCode(...symbol),
  nftsCount: nftsCount.toJSON(),
});

export default function Collections(props) {
  const { api, keyring } = useSubstrate();
  const { accountPair } = props;

  const [collectionIds, setCollectionIds] = useState([]);
  const [collectionsMapFinal, setCollectionsMapFinal] = useState([]);
  const [status, setStatus] = useState('');

  const subscribeCountCollections = () => {
    let unsub = null;

    const asyncFetch = async () => {
      unsub = await api.query.rmrkCore.collectionIndex(async (count) => {
        //Fetch all collection keys
        console.log(
          'A--> ' + JSON.stringify(await api.query.rmrkCore.collections)
        );
        const entries = await api.query.rmrkCore.collections.entries();
        const ids = entries.map((entry) => entry[0].args.toString());
        console.log('updated ids: ' + ids);

        setCollectionIds(ids);
      });
    };

    asyncFetch();

    return () => {
      unsub && unsub();
    };
  };

  const subscribeCollections = () => {
    let unsub = null;

    const asyncFetch = async () => {
      console.log('collectionIds=' + collectionIds);

      unsub = await api.query.rmrkCore.collections.entries((collections) => {
        console.log(
          'after await, in  -- StorageEntryPromiseMulti, collections=' +
            JSON.stringify(collections.value)
        );

        if (collections.length != 0) {
          const collectionsMap = collections.map((collection) =>
            parseCollection(
              collection[0].args.toString(),
              collection[1].unwrap()
            )
          );
          setCollectionsMapFinal(collectionsMap);
        }
      });
    };

    asyncFetch();

    return () => {
      unsub && unsub();
    };
  };

  useEffect(subscribeCountCollections, [api, keyring]);
  useEffect(subscribeCollections, [api, keyring, collectionIds]);

  return (
    <Grid.Column width={16}>
      <h1>Collections</h1>
      <CollectionCards
        collections={collectionsMapFinal}
        accountPair={accountPair}
        setStatus={setStatus}
      />
      <Form style={{ margin: '1em 0' }}>
        <Form.Field style={{ textAlign: 'center' }}>
          <CreateCollectionModal
            accountPair={accountPair}
            setStatus={setStatus}
          />
        </Form.Field>
      </Form>
      <div style={{ overflowWrap: 'break-word' }}>{status}</div>
    </Grid.Column>
  );
}

// --- Create Collection Modal ---
const CreateCollectionModal = (props) => {
  const { accountPair, setStatus } = props;
  const [open, setOpen] = React.useState(false);
  const [formValue, setFormValue] = React.useState({});

  const formChange = (key) => (ev, el) => {
    setFormValue({ ...formValue, [key]: el.value });
  };

  const confirmAndClose = (setStatus) => {
    setOpen(false);
    setStatus;
    // if (unsub && typeof unsub === 'function') unsub();
  };

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={
        <Button basic color="green">
          Create Collection
        </Button>
      }
    >
      <Modal.Header>Create Collection</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Input
            fluid
            label="Metadata"
            placeholder="Metadata"
            onChange={formChange('metadata')}
          />
          <Form.Input
            fluid
            label="Max"
            placeholder="Max"
            onChange={formChange('max')}
          />
          <Form.Input
            fluid
            label="Symbol"
            placeholder="Symbol"
            onChange={formChange('symbol')}
          />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button basic color="grey" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <CreateCollectionButton
          newCollectionValues={formValue}
          accountPair={accountPair}
          setStatus={confirmAndClose}
        />
      </Modal.Actions>
    </Modal>
  );
};
