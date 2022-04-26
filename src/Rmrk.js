import React, { useEffect, useState } from 'react';
import { Grid, Form } from 'semantic-ui-react';

import { useSubstrate } from './substrate-lib';
import CollectionCards from './CollectionCards';
import CreateCollectionModal from './modals/CreateCollectionModal';

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
      <h1>Status</h1>
      <div style={{ overflowWrap: 'break-word' }}>{status}</div>
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
    </Grid.Column>
  );
}
