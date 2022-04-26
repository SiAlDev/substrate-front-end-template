import React from 'react';
import { TxButton } from '../substrate-lib/components';

const CreateCollectionButton = (props) => {
  const { newCollectionValues, accountPair, setStatus } = props;

  return (
    <TxButton
      accountPair={accountPair}
      label="Create Collection"
      type="SIGNED-TX"
      setStatus={setStatus}
      onClick={setStatus}
      attrs={{
        palletRpc: 'rmrkCore',
        callable: 'createCollection',
        inputParams:
          newCollectionValues === undefined
            ? ['', 0, '']
            : [
                newCollectionValues.metadata,
                newCollectionValues.max,
                newCollectionValues.symbol,
              ],
        paramFields: [true, true, true],
      }}
    />
  );
};

const DestroyCollectionButton = (props) => {
  const { collection, accountPair, setStatus } = props;

  return (
    <TxButton
      accountPair={accountPair}
      label="Destroy Collection"
      type="SIGNED-TX"
      setStatus={setStatus}
      onClick={setStatus}
      attrs={{
        palletRpc: 'rmrkCore',
        callable: 'destroyCollection',
        inputParams: [collection.collectionId],
        paramFields: [true],
      }}
    />
  );
};

const ChangeIssuerButton = (props) => {
  const { collectionId, newIssuerAddress, accountPair, setStatus } = props;

  return (
    <TxButton
      accountPair={accountPair}
      label="Change Issuer"
      type="SIGNED-TX"
      setStatus={setStatus}
      onClick={setStatus}
      attrs={{
        palletRpc: 'rmrkCore',
        callable: 'changeIssuer',
        inputParams: [collectionId, newIssuerAddress],
        paramFields: [true, true],
      }}
    />
  );
};

export { CreateCollectionButton, DestroyCollectionButton, ChangeIssuerButton };
