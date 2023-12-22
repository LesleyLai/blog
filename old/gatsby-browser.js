require("typeface-pt-serif");
require("typeface-pt-sans");
require("typeface-pt-mono");
require("typeface-noto-serif-sc");
require("typeface-noto-sans-sc");

const languages = require("./src/utils/translations").languages;

exports.shouldUpdateScroll = ({
    prevRouterProps,
    routerProps: { location },
    getSavedScrollPosition
  }) => {
      if (!prevRouterProps) return true;
      const previousLocation = prevRouterProps.location;
      for (lang of languages) {
        const regex = new RegExp(`\/${lang}\/[0-9]+`, "g");

        const isPaginationPage = (path) => (
            path.match(regex) || 
            (lang == "en" && path == "/") ||
             (lang != "en" && path == `/${lang}`)
        );

        // Return false if the transition is a pagination link
        if ((isPaginationPage(location.pathname) && isPaginationPage(previousLocation.pathname))) {
          return "pagination";
        };
      }

      return true;
  }