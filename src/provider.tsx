import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren, forwardRef, useState } from "react";
import {
  useNavigate,
  Link as RouterLink,
  LinkProps as RouterLinkProps,
  Outlet,
} from "react-router-dom";
import { CssBaseline, LinkProps, ThemeProvider } from "@mui/material";
import { AxiosError } from "axios";
import { createTheme } from "@mui/material";
import { HelmetProvider } from "react-helmet-async";

const TanstackProvider = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();
  const [client] = useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          throwOnError: (err) => {
            if (err instanceof AxiosError && err.response?.status === 401) {
              navigate("/");
              return false;
            }
            return true;
          },
        },
      },
    })
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

const LinkBehavior = forwardRef<
  HTMLAnchorElement,
  Omit<RouterLinkProps, "to"> & { href: RouterLinkProps["to"] }
>((props, ref) => {
  const { href, ...other } = props;
  return <RouterLink ref={ref} to={href} {...other} />;
});

LinkBehavior.displayName = "LinkBehavior";

const Provider = () => {
  const [theme] = useState(
    createTheme({
      palette: {
        primary: {
          main: "#007fff",
        },
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            a: {
              width: "fit-content",
              textDecoration: "none",
              color: "inherit",
            },

            button: {
              width: "fit-content",
            },

            img: {
              verticalAlign: "middle",
            },

            html: {
              fontSize: "16px",
              minWidth: "320px",
            },
          },
        },
        MuiLink: {
          defaultProps: {
            component: LinkBehavior,
          } as LinkProps,
        },
        MuiButtonBase: {
          defaultProps: {
            LinkComponent: LinkBehavior,
          },
        },
      },
    })
  );
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TanstackProvider>
        <HelmetProvider>{<Outlet />}</HelmetProvider>
      </TanstackProvider>
    </ThemeProvider>
  );
};

export default Provider;
