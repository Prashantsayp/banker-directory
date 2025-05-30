import {
  Box,
  Typography,
  Card,
  CardHeader,
  Divider,
  Avatar,
  Grid,
  Button
} from '@mui/material';

import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';

function Feed() {
  const feed = [
     {
      name: 'Harpreet Kaur',
      jobtitle: 'Financial Analyst',
      company: 'Infosys',
      avatar: '/static/images/avatars/1.jpg'
    },
    {
      name: 'Ravi Verma',
      jobtitle: 'Software Engineer',
      company: 'TCS',
      avatar: '/static/images/avatars/2.jpg'
    },
    {
      name: 'Neha Sharma',
      jobtitle: 'Marketing Manager',
      company: 'HDFC Bank',
      avatar: '/static/images/avatars/3.jpg'
    },
    {
      name: 'Amit Dubey',
      jobtitle: 'Operations Head',
      company: 'Wipro',
      avatar: '/static/images/avatars/4.jpg'
    },
    {
      name: 'Sneha Iyer',
      jobtitle: 'Human Resources',
      company: 'Reliance Industries',
      avatar: '/static/images/avatars/5.jpg'
    },
    {
      name: 'Vikram Mehta',
      jobtitle: 'Data Scientist',
      company: 'Zoho',
      avatar: '/static/images/avatars/6.jpg'
    }
  ];

  return (
    <Card>
      <CardHeader title="Followers Feed" />
      <Divider />
      <Box p={2}>
        <Grid container spacing={0}>
          {feed.map((_feed) => (
            <Grid key={_feed.name} item xs={12} sm={6} lg={4}>
              <Box p={3} display="flex" alignItems="flex-start">
                <Avatar src={_feed.avatar} />
                <Box pl={2}>
                  <Typography gutterBottom variant="subtitle2">
                    {_feed.company}
                  </Typography>
                  <Typography variant="h4" gutterBottom>
                    {_feed.name}
                  </Typography>
                  <Typography color="text.primary" sx={{ pb: 2 }}>
                    {_feed.jobtitle}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AddTwoToneIcon />}
                  >
                    Follow
                  </Button>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Card>
  );
}

export default Feed;
