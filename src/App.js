import { BrowserRouter } from 'react-router-dom';

//Components
import Header from "./layout/header/header"
import Sidebar from './layout/sidebar/sidebar.jsx';
import SidebarRight from './layout/sidebar-right/sidebar-right.jsx';
import TopMenu from './layout/top-menu/top-menu.jsx';
import Content from './layout/content/content.jsx';
import FloatSubMenu from './layout/float-sub-menu/float-sub-menu.jsx';

//Context
import {useAppSettings} from "./config/app-settings";

function App() {
  
  const { appHeaderNone, 
          appSidebarNone,
          appSidebarEnd,
          appSidebarWide,
          appSidebarLight,
          appSidebarMinify,
          appSidebarMobileToggled,
          appTopMenu,
          appContentFullHeight,
          appSidebarTwo,
          appSidebarEndToggled,
          appSidebarEndMobileToggled,
          hasScroll,
		  appContentNone,
        } = useAppSettings();

  return (
		
	<div className={
		'app app-sidebar-fixed ' + 
		(appHeaderNone ? 'app-without-header ' : 'app-header-fixed ') + 
		(appSidebarNone ? 'app-without-sidebar ' : '') + 
		(appSidebarEnd ? 'app-with-end-sidebar ' : '') +
		(appSidebarWide ? 'app-with-wide-sidebar ' : '') +
		(appSidebarLight ? 'app-with-light-sidebar ' : '') +
		(appSidebarMinify ? 'app-sidebar-minified ' : '') + 
		(appSidebarMobileToggled ? 'app-sidebar-mobile-toggled ' : '') + 
		(appTopMenu ? 'app-with-top-menu ' : '') + 
		(appContentFullHeight ? 'app-content-full-height ' : '') + 
		(appSidebarTwo ? 'app-with-two-sidebar ' : '') + 
		(appSidebarEndToggled ? 'app-sidebar-end-toggled ' : '') + 
		(appSidebarEndMobileToggled ? 'app-sidebar-end-mobile-toggled ' : '') + 
		(hasScroll ? 'has-scroll ' : '')
	}>
		<BrowserRouter>
			{!appHeaderNone && (<Header />)}
			{!appSidebarNone && (<Sidebar />)}
			{appSidebarTwo && (<SidebarRight />)}
			{appTopMenu && (<TopMenu />)}
			{!appContentNone && (<Content />)}
			<FloatSubMenu />
		</BrowserRouter>	
	</div>
  );
}

export default App;
