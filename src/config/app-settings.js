import React, { useState, useContext } from "react";

export const AppSettings = React.createContext();

const AppSettingsProvider = ({ children }) => {

  //App title
  const [appTitleConfig, setAppTitleConfig] = useState('La Rosalina Resort'); //Configurable

  //Header props
  const [appHeaderNone, setAppHeaderNone] = useState(false); //Configurable
  const [appHeaderInverse, setAppHeaderInverse] = useState(true); //Configurable
  const [appHeaderMegaMenu, setAppHeaderMegaMenu] = useState(false); //Configurable
  const [appHeaderSearchBar, setAppHeaderSearchBar] = useState(false); //Configurable
  const [appHeaderNotificationBar, setAppHeaderNotificationBar] = useState(true); //Configurable
  const [appHeaderLanguageBar, setAppHeaderLanguageBar] = useState(false); //Configurable
  const [hasScroll, setHasScroll] = useState(false);

  //Sidebar props
  const [appSidebarNone, setAppSidebarNone] = useState(false); //Configurable
  const [appSidebarWide, setAppSidebarWide] = useState(false); //Configurable
  const [appSidebarLight, setAppSidebarLight] = useState(false); //Configurable
  const [appSidebarMinify, setAppSidebarMinify] = useState(false);
  const [appSidebarMobileToggled, setAppSidebarMobileToggled] = useState(false);
  const [appSidebarTransparent, setAppSidebarTransparent] = useState(false); //Configurable
  const [appSidebarSearch, setAppSidebarSearch] = useState(false); //Configurable

  //Sidebar menú props
  const [appSidebarFloatSubMenuActive, setAppSidebarFloatSubMenuActive] = useState(false);
  const [appSidebarFloatSubMenu, setAppSidebarFloatSubMenu] = useState('');
  const [appSidebarFloatSubMenuTop, setAppSidebarFloatSubMenuTop] = useState('auto');
  const [appSidebarFloatSubMenuLeft, setAppSidebarFloatSubMenuLeft] = useState('auto');
  const [appSidebarFloatSubMenuBottom, setAppSidebarFloatSubMenuBottom] = useState('auto');
  const [appSidebarFloatSubMenuLineTop, setAppSidebarFloatSubMenuLineTop] = useState('auto');
  const [appSidebarFloatSubMenuLineBottom, setAppSidebarFloatSubMenuLineBottom] = useState('auto');
  const [appSidebarFloatSubMenuArrowTop, setAppSidebarFloatSubMenuArrowTop] = useState('auto');
  const [appSidebarFloatSubMenuArrowBottom, setAppSidebarFloatSubMenuArrowBottom] = useState('auto');
  const [appSidebarFloatSubMenuOffset, setAppSidebarFloatSubMenuOffset] = useState('');

  //Top menú
  const [appTopMenu, setAppTopMenu] = useState(false); //Configurable
  const [appTopMenuMobileToggled, setAppTopMenuMobileToggled] = useState(false);
  
  //Sidebar two
  const [appSidebarTwo, setAppSidebarTwo] = useState(false); //Configurable

  //Sidebar End
  const [appSidebarEnd, setAppSidebarEnd] = useState(false);
  const [appSidebarEndToggled, setAppSidebarEndToggled] = useState(false);  
  const [appSidebarEndMobileToggled, setAppSidebarEndMobileToggled] = useState(false);
  
  //Content
  const [appContentNone, setAppContentNone] = useState(false);
  const [appContentClass, setAppContentClass] = useState('');
  const [appContentFullHeight, setAppContentFullHeight] = useState(false);

  //Funciones auxiliares
  const toggleAppSidebarMinify = (e) => {
    e.preventDefault();
    if (appSidebarMinify) {
    setAppSidebarFloatSubMenuActive(false);
    }
    setAppSidebarMinify(!appSidebarMinify);
  };
  
  const toggleAppSidebarMobile = (e) => {
    e.preventDefault();
    setAppSidebarMobileToggled(!appSidebarMobileToggled);
  };
  
  const handleSetAppSidebarNone = (value) => {
    setAppSidebarNone(value);
  };
  
  const handleSetAppSidebarMinified = (value) => {
    setAppSidebarMinify(value);
  };
  
  const handleSetAppSidebarWide = (value) => {
    setAppSidebarWide(value);
  };
  
  const handleSetAppSidebarLight = (value) => {
    setAppSidebarLight(value);
  };
  
  const handleSetAppSidebarTransparent = (value) => {
    setAppSidebarTransparent(value);
  };
  
  const handleSetAppSidebarSearch = (value) => {
    setAppSidebarSearch(value);
  };
  
  const toggleAppSidebarEnd = (e) => {
    e.preventDefault();
    setAppSidebarEndToggled(!appSidebarEndToggled);
  };
  
  const toggleAppSidebarEndMobile = (e) => {
    e.preventDefault();
    setAppSidebarEndMobileToggled(!appSidebarEndMobileToggled);
  };
  
  const handleSetAppSidebarEnd = (value) => {
    setAppSidebarEnd(value);
  };
  
  var appSidebarFloatSubMenuRemove;
  var appSidebarFloatSubMenuCalculate;
  var appSidebarFloatSubMenuRemoveTime = 250;
  const handleAppSidebarOnMouseOver = (e, menu) => {
    if (appSidebarMinify) {
      if (menu.children) {
        var left = (document.getElementById('sidebar').offsetWidth + document.getElementById('sidebar').offsetLeft) + 'px';
        
        clearTimeout(appSidebarFloatSubMenuRemove);
        clearTimeout(appSidebarFloatSubMenuCalculate);
    
        setAppSidebarFloatSubMenu(menu);
        setAppSidebarFloatSubMenuActive(true);
        setAppSidebarFloatSubMenuLeft(left);
        
        var offset = e.currentTarget.offsetParent.getBoundingClientRect();
        
        appSidebarFloatSubMenuCalculate = setTimeout(() => {
          var targetTop = offset.top;
          var windowHeight = window.innerHeight;
          var targetHeight = document.querySelector('.app-sidebar-float-submenu-container').offsetHeight;
          var top, bottom, arrowTop, arrowBottom, lineTop, lineBottom;
          
          if ((windowHeight - targetTop) > targetHeight) {
            top = offset.top + 'px';
            bottom = 'auto';
            arrowTop = '20px';
            arrowBottom = 'auto';
            lineTop = '20px';
            lineBottom = 'auto';
          } else {
            var aBottom = (windowHeight - targetTop) - 21;
            top = 'auto';
            bottom = '0';
            arrowTop = 'auto';
            arrowBottom = aBottom + 'px';
            lineTop = '20px';
            lineBottom = aBottom + 'px';
          }
                    
          setAppSidebarFloatSubMenuTop(top);
          setAppSidebarFloatSubMenuBottom(bottom);
          setAppSidebarFloatSubMenuLineTop(lineTop);
          setAppSidebarFloatSubMenuLineBottom(lineBottom);
          setAppSidebarFloatSubMenuArrowTop(arrowTop);
          setAppSidebarFloatSubMenuArrowBottom(arrowBottom);
          setAppSidebarFloatSubMenuOffset(offset);

        }, 0);
        
      } else {
        appSidebarFloatSubMenuRemove = setTimeout(() => {          
          setAppSidebarFloatSubMenu('');
          setAppSidebarFloatSubMenuActive(false);          
        }, appSidebarFloatSubMenuRemoveTime);
      }
    }
  }

  const handleAppSidebarOnMouseOut = (e) => {
    if (appSidebarMinify) {
      appSidebarFloatSubMenuRemove = setTimeout(() => setAppSidebarFloatSubMenuActive(false)
      , appSidebarFloatSubMenuRemoveTime);
    }
  }

  const handleAppSidebarFloatSubMenuClick = () => {
    if (appSidebarMinify) {
      const windowHeight = window.innerHeight;
      const targetHeight = document.getElementById('app-sidebar-float-submenu').offsetHeight;
      const targetTop = appSidebarFloatSubMenuOffset.top;
      const top = ((windowHeight - targetTop) > targetHeight) ? targetTop : 'auto';
      const left = (appSidebarFloatSubMenuOffset.left + document.getElementById('sidebar').offsetWidth) + 'px';
      const bottom = ((windowHeight - targetTop) > targetHeight) ? 'auto' : '0';
      const arrowTop = ((windowHeight - targetTop) > targetHeight) ? '20px' : 'auto';
      const arrowBottom = ((windowHeight - targetTop) > targetHeight) ? 'auto' : ((windowHeight - targetTop) - 21) + 'px';
      const lineTop = ((windowHeight - targetTop) > targetHeight) ? '20px' : 'auto';
      const lineBottom = ((windowHeight - targetTop) > targetHeight) ? 'auto' : ((windowHeight - targetTop) - 21) + 'px';
			
      setAppSidebarFloatSubMenuTop(top);
      setAppSidebarFloatSubMenuLeft(left);
      setAppSidebarFloatSubMenuBottom(bottom);
      setAppSidebarFloatSubMenuLineTop(lineTop);
      setAppSidebarFloatSubMenuLineBottom(lineBottom);
      setAppSidebarFloatSubMenuArrowTop(arrowTop);
      setAppSidebarFloatSubMenuArrowBottom(arrowBottom);
    }
  }

  const handleSetAppContentNone = (value) => {
    setAppContentNone(value);
  }

  const handleSetAppContentClass = (value) => {
    setAppContentClass(value);
  }

  const handleSetAppContentFullHeight = (value) => {
    setAppContentFullHeight(value);
  }

  const handleSetAppHeaderNone = (value) => {
    setAppHeaderNone(value);
  }

  const handleSetAppHeaderInverse = (value) => {
    setAppHeaderInverse(value);
  }

  const handleSetAppHeaderMegaMenu = (value) => {
    setAppHeaderMegaMenu(value);
  }

  const handleSetAppHeaderLanguageBar = (value) => {
    setAppHeaderLanguageBar(value);
  };

  const handleSetAppTopMenu = (value) => {
    setAppTopMenu(value);
  };

  const toggleAppTopMenuMobile = (e) => {
    e.preventDefault();
    setAppTopMenuMobileToggled(!appTopMenuMobileToggled);
  };

  const handleSetAppSidebarTwo = (value) => {
    setAppSidebarTwo(value);
    setAppSidebarEndToggled(value);
  };

  const handleSetAppBoxedLayout = (value) => {
    if (value === true) {
      document.body.classList.add('boxed-layout');
    } else {
      document.body.classList.remove('boxed-layout');
    }
  };

    return (
    <AppSettings.Provider value={{
      appTitleConfig,
      appHeaderNone,
      appHeaderInverse,
      appHeaderMegaMenu,
      appHeaderSearchBar,
      appHeaderNotificationBar,
      appHeaderLanguageBar, 
      hasScroll,
      appSidebarNone,
      appSidebarWide,
      appSidebarLight,
      appSidebarMinify,
      appSidebarMobileToggled,
      appSidebarTransparent,
      appSidebarSearch,
      appSidebarFloatSubMenuActive,
      appSidebarFloatSubMenu,
      appSidebarFloatSubMenuTop,
      appSidebarFloatSubMenuLeft,
      appSidebarFloatSubMenuBottom,
      appSidebarFloatSubMenuLineTop,
      appSidebarFloatSubMenuLineBottom,
      appSidebarFloatSubMenuArrowTop,
      appSidebarFloatSubMenuArrowBottom,
      appSidebarFloatSubMenuOffset,
      appTopMenu,
      appTopMenuMobileToggled,
      appSidebarTwo, 
      appSidebarEnd,
      appSidebarEndToggled,
      appSidebarEndMobileToggled,
      appContentNone,
      appContentClass,
      appContentFullHeight,
      toggleAppSidebarMinify,
      toggleAppSidebarMobile,
      handleSetAppSidebarNone,
      handleSetAppSidebarMinified,
      handleSetAppSidebarWide,
      handleSetAppSidebarLight,
      handleSetAppSidebarTransparent,
      handleSetAppSidebarSearch,
      toggleAppSidebarEnd,
      toggleAppSidebarEndMobile,
      handleSetAppSidebarEnd,
      handleAppSidebarOnMouseOver,
      handleAppSidebarOnMouseOut,
      handleAppSidebarFloatSubMenuClick,
      handleSetAppContentNone,
      handleSetAppContentClass,
      handleSetAppContentFullHeight,
      handleSetAppHeaderNone,
      handleSetAppHeaderInverse,
      handleSetAppHeaderMegaMenu,
      handleSetAppHeaderLanguageBar,
      handleSetAppTopMenu,
      toggleAppTopMenuMobile,
      handleSetAppSidebarTwo,
      handleSetAppBoxedLayout,
     }}>
      {children}
    </AppSettings.Provider>
  );
};

export default AppSettingsProvider;

export const useAppSettings = () => useContext(AppSettings);