import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import LectureContent from './LectureContent'
import MenuBookIcon from '@material-ui/icons/MenuBook';
import Hidden from '@material-ui/core/Hidden';
import LectureAudioPlayer from './LectureAudioPlayer';
import gql from 'graphql-tag'
import {useQuery} from '@apollo/react-hooks'

const GET_CLASS = gql`
  {
    schools {
      name
      classes {
        title
        lectures {
          name
        }
      }
    }
  }
`;

const drawerWidth = 300;

interface DrawerProps {
  courseName: string,
  container?: Element
}

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
    backgroundColor: 'mediumaquamarine',
    boxShadow: 'none'
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: 'steelblue',
    color: 'white'
  },
  content: {
    flexGrow: 1
  },
}));

export default function TopBarDrawer(props: DrawerProps) {
  const { container } = props;
  const theme = useTheme();
  const classes = useStyles(theme);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [currentValue, setCurrentValue] = React.useState(0);
  const [currentNanos, setCurrentNanos] = React.useState(0);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const changeValue = (value: number, nanos: number) => {
    setCurrentValue(value)
    setCurrentNanos(nanos)
  };

  const returnList = []
  const { loading, error, data } = useQuery(GET_CLASS);
  if (loading) {
    returnList.push("Loading...")
  }
  else if (error) {
    returnList.push(error.message)
  } else {
    for(var i = 0; i < data.schools[0].classes[0].lectures.length; i++) {
      returnList.push(data.schools[0].classes[0].lectures[i].name)
    }
  }
  

  //eventually this will be built with an api call

  const lectureList = ['Lecture 1', 'Lecture 2', 'Lecture 3'];

  //create 

  //feed into state

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List>
        {returnList.map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{<MenuBookIcon/>}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
    </div>
  );
  
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Lecshare 
          </Typography>
         
        </Toolbar>
        
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
            <LectureContent courseName={props.courseName} currentSeconds={currentValue} currentNanos={currentNanos}/>
            <LectureAudioPlayer source={'./vikelabs_test1.ogg'} onChange={changeValue} displacement={drawerWidth}/>
      </main>
    </div>
  ); 
}
