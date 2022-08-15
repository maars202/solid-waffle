import React, { FC, } from 'react';
import Context from './Context';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/home';
import ManageNFTs from './components/manageNFTs';
import ManageNFTs2 from './components/manageNFTs2';
import NavBar from './components/common/NavBar';
import Main from './components/common/Main';

export const App: FC = () => {

    return (
        <Context>
            <BrowserRouter>
                <NavBar />
                <Main
                    childComp={
                        <Routes>
                             <Route path="/wallet2" element={<ManageNFTs2 />} />
                            <Route path="/wallet" element={<ManageNFTs />} />
                            <Route path="/" element={<Home />} />
                        </Routes>
                    }
                />
            </BrowserRouter>
        </Context>
    );
};
