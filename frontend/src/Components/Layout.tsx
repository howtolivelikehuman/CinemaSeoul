import React from 'react';
import { Header } from '.';

const Layout : React.FC = ({children}) => {
	// user 페이지의 header와 페이지들의 공통요소를 포함하는 틀
	return (
		<>
			<Header/>
			<div>
				{children}
			</div>
		</>
	);
};

export default Layout;