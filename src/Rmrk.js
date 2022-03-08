import React, { useEffect, useState } from 'react';
import { Form, Grid } from 'semantic-ui-react';

import { useSubstrate } from './substrate-lib';
import { TxButton } from './substrate-lib/components';

import CollectionCards from './CollectionCards';

const parseCollection = ({ issuer, metadata, max, symbol, nfts_count}) => ({
  issuer,
  metadata: metadata,
  max: max,
  symbol: symbol,
  nfts_count: nfts_count
});

// .toJSON()
// "issuer": "AccountId",
//       "metadata": "BoundedString",
//       "max": "[u32]",
//       "symbol": "BoundedString",
//       "nfts_count": "[u32]"

function dumpObject (obj) {
  var output, property;
  output = '';
  for (property in obj) {
      
      output += 'property=' + property + ': obj=' + obj[property] + '; ---  ';
  }
  console.log(output);
}

export default function Collections (props) {
  const { api, keyring } = useSubstrate();
  const { accountPair } = props;

  const [collectionIds, setCollectionIds] = useState([]);
  const [collections, setCollections] = useState([]);
  const [status, setStatus] = useState('');

  const subscribeCountCollections = () => {
    let unsub = null;

    const asyncFetch = async () => {
      
      unsub = await api.query.rmrkCore.collectionIndex(async count => {
        //Fetch all collection keys
        console.log('A--> ' + JSON.stringify(await api.query.rmrkCore.collections));
        const entries = await api.query.rmrkCore.collections.entries();
        const ids = entries.map(entry => entry[0]);
        console.log('updated ids: ' + ids);
        
        setCollectionIds(ids);

        // let collectionsMap;
        // entries.forEach(collection => {
        //   console.log('element=' + collection);
        
        //  collectionsMap = collections.map(collection => parseCollection(collection));
        // });
        // setCollections(collectionsMap);

        //get values of each property in the collection
        //const ids = entries.map(entry => entry[1].unwrap().metadata);

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

      unsub = await api.query.rmrkCore.collections.multi(collectionIds, collections => {
        console.log('after await, in  -- StorageEntryPromiseMulti, collections=' + JSON.stringify(collections.value));

        if (collections.value != null) {
          const collectionsMap = collections.map(collection => parseCollection(collection.unwrap()));
          setCollections(collectionsMap);
        }
      });

      //get values of each property in the collection
      //const ids = entries.map(entry => entry[1].unwrap().metadata);

    };

    asyncFetch();

    return () => {
      unsub && unsub();
    };
  };

  useEffect(subscribeCountCollections, [api, keyring]);
  useEffect(subscribeCollections, [api, keyring, collectionIds]);

  return <Grid.Column width={16}>
    <h1>Collections</h1>
    <CollectionCards collections={collections} accountPair={accountPair} setStatus={setStatus} />
    <Form style={{ margin: '1em 0' }}>
      <Form.Field style={{ textAlign: 'center' }}>
        <TxButton
          accountPair={accountPair}
          label='Create Collection'
          type='SIGNED-TX'
          setStatus={setStatus}
          attrs={{
            palletRpc: 'rmrkSubstrate',
            callable: 'createCollection',
            inputParams: [],
            paramFields: []
          }}
        />
      </Form.Field>
    </Form>
    <div style={{ overflowWrap: 'break-word' }}>{status}</div>
  </Grid.Column>;
}