import React from 'react';

import { Redirect, Route, Switch } from 'react-router-dom';
import { AdminLayout } from '../../Components';
import {
	AdminAdmin,
	AdminMain,
	AdminAsk,
	AdminBlackList,
	AdminBookRecord,
	AdminEvent,
	AdminFAQ,
	AdminGenre,
	AdminHall,
	AdminHome,
	AdminMovie,
	AdminNotice,
	AdminPay,
	AdminPeople,
	AdminSales,
	AdminShowSCH,
	AdminStore,
	AdminTheater,
	AdminError,
} from '../../Pages/Admin';

const AdminRouter : React.FC = () => (
	<AdminLayout>
		<Switch>
			<Route path="/admin/ask" component={AdminAsk}/>
			<Route path="/admin/blacklist" component={AdminBlackList}/>
			<Route path="/admin/book" component={AdminBookRecord}/>
			<Route path="/admin/event" component={AdminEvent}/>
			<Route path="/admin/faq" component={AdminFAQ}/>
			<Route path="/admin/genre" component={AdminGenre}/>
			<Route path="/admin/hall" component={AdminHall}/>
			<Route path="/admin/home" component={AdminHome}/>
			<Route path="/admin/main" component={AdminMain}/>
			<Route path="/admin/movie" component={AdminMovie}/>
			<Route path="/admin/notice" component={AdminNotice}/>
			<Route path="/admin/pay" component={AdminPay}/>
			<Route path="/admin/people" component={AdminPeople}/>
			<Route path="/admin/sales" component={AdminSales}/>
			<Route path="/admin/showsch" component={AdminShowSCH}/>
			<Route path="/admin/store" component={AdminStore}/>
			<Route path="/admin/theater" component={AdminTheater}/>
			<Route path="/admin/error" component={AdminError}/>
			<Redirect to="/admin/movie" />
		</Switch>
	</AdminLayout>
);

export default AdminRouter;
