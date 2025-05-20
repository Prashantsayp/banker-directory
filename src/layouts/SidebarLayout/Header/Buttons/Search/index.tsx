import { forwardRef, Ref, useState, ReactElement, ChangeEvent } from 'react';
import {
  Avatar,
  Link,
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  lighten,
  List,
  ListItem,
  ListItemAvatar,
  TextField,
  Theme,
  Tooltip,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  Hidden
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { TransitionProps } from '@mui/material/transitions';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import FindInPageTwoToneIcon from '@mui/icons-material/FindInPageTwoTone';
import ChevronRightTwoToneIcon from '@mui/icons-material/ChevronRightTwoTone';

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const DialogWrapper = styled(Dialog)(
  () => `
    .MuiDialog-container {
        height: auto;
    }
    .MuiDialog-paperScrollPaper {
        max-height: calc(100vh - 64px)
    }
`
);

const SearchInputWrapper = styled(TextField)(
  ({ theme }) => `
    background: ${theme.colors.alpha.white[100]};
    .MuiInputBase-input {
        font-size: ${theme.typography.pxToRem(17)};
    }
`
);

const DialogTitleWrapper = styled(DialogTitle)(
  ({ theme }) => `
    background: ${theme.colors.alpha.black[5]};
    padding: ${theme.spacing(3)}
`
);

// 1. Mock dataset for search results
const searchData = [
  {
    title: 'Dashboard for Healthcare Platform',
    description: 'This page contains all the necessary information for managing all hospital staff.',
    href: '/dashboard'
  },
  {
    title: 'Example Projects Application',
    description: 'This is yet another search result pointing to an app page.',
    href: '/example-projects'
  },
  {
    title: 'Search Results Page',
    description: 'Choose if you would like to show or not this typography section here...',
    href: '/search-results'
  }
  // Add more items as needed...
];

function HeaderSearch() {
  const [openSearchResults, setOpenSearchResults] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [open, setOpen] = useState(false);

  // 2. Filter items based on searchValue
  const filteredResults = searchData.filter(
    (item) =>
      item.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.description.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchValue(event.target.value);

    if (event.target.value) {
      if (!openSearchResults) setOpenSearchResults(true);
    } else {
      setOpenSearchResults(false);
    }
  };

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Tooltip arrow title="Search">
        <IconButton color="primary" onClick={handleClickOpen}>
          <SearchTwoToneIcon />
        </IconButton>
      </Tooltip>

      <DialogWrapper
        open={open}
        TransitionComponent={Transition}
        keepMounted
        maxWidth="md"
        fullWidth
        scroll="paper"
        onClose={handleClose}
      >
        <DialogTitleWrapper>
          <SearchInputWrapper
            value={searchValue}
            autoFocus={true}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchTwoToneIcon />
                </InputAdornment>
              )
            }}
            placeholder="Search terms here..."
            fullWidth
            label="Search"
          />
        </DialogTitleWrapper>
        <Divider />

        {openSearchResults && (
          <DialogContent>
            <Box sx={{ pt: 0, pb: 1 }} display="flex" justifyContent="space-between">
              <Typography variant="body2" component="span">
                Search results for{' '}
                <Typography sx={{ fontWeight: 'bold' }} variant="body1" component="span">
                  {searchValue}
                </Typography>
              </Typography>
              <Link href="#" variant="body2" underline="hover">
                Advanced search
              </Link>
            </Box>
            <Divider sx={{ my: 1 }} />
            <List disablePadding>
              {/* 3. Show filtered results */}
              {filteredResults.length > 0 ? (
                filteredResults.map((item) => (
                  <div key={item.title}>
                    <ListItem button component="a" href={item.href}>
                      <Hidden smDown>
                        <ListItemAvatar>
                          <Avatar sx={{ background: (theme: Theme) => theme.palette.secondary.main }}>
                            <FindInPageTwoToneIcon />
                          </Avatar>
                        </ListItemAvatar>
                      </Hidden>
                      <Box flex="1">
                        <Box display="flex" justifyContent="space-between">
                          <Link
                            href={item.href}
                            underline="hover"
                            sx={{ fontWeight: 'bold' }}
                            variant="body2"
                          >
                            {item.title}
                          </Link>
                        </Box>
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{
                            color: (theme: Theme) => lighten(theme.palette.secondary.main, 0.5)
                          }}
                        >
                          {item.description}
                        </Typography>
                      </Box>
                      <ChevronRightTwoToneIcon />
                    </ListItem>
                    <Divider sx={{ my: 1 }} component="li" />
                  </div>
                ))
              ) : (
                <Typography color="text.secondary" sx={{ p: 2 }}>
                  No results found.
                </Typography>
              )}
            </List>
            <Divider sx={{ mt: 1, mb: 2 }} />
            <Box sx={{ textAlign: 'center' }}>
              <Button color="primary">View all search results</Button>
            </Box>
          </DialogContent>
        )}
      </DialogWrapper>
    </>
  );
}

export default HeaderSearch;