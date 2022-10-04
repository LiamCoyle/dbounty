import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

import { useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { InjectedConnector } from "@web3-react/injected-connector";
import appConfig from "../../configs/app";
import Link from "next/link";

export default function MenuAppBar() {
  const injectedConnector = new InjectedConnector(appConfig.blockchain);
  const { chainId, account, activate, active, library } =
    useWeb3React<Web3Provider>();

  const onClick = () => {
    activate(injectedConnector);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Link href="/bounties">
            <a>Bounties</a>
          </Link>

          <div>
            {active ? (
              <h2>{account}</h2>
            ) : (
              <button type="button" onClick={onClick}>
                Connect
              </button>
            )}
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
