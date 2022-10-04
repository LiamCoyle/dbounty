import { createContext, ReactNode, useState } from "react";

interface Props {
  children?: ReactNode;
  // any props that come into the component
}

interface IBountiesContext {
  bounties: Array<any>;
  setBounties: Function;
}

const BountiesContext = createContext<IBountiesContext>({
  bounties: [],
  setBounties: () => {},
});

const BountiesProvider = ({ children }: Props) => {
  const [bounties, setBounties] = useState([]);

  return (
    <BountiesContext.Provider value={{ bounties, setBounties }}>
      {children}
    </BountiesContext.Provider>
  );
};

export { BountiesContext, BountiesProvider };
