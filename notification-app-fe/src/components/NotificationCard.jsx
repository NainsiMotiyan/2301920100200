import {
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

const chipColors = {
  Placement: "success",
  Result: "primary",
  Event: "warning",
};

export function NotificationCard({ notification }) {
  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: 2,
        transition: "0.2s",
        "&:hover": {
          boxShadow: 6,
        },
      }}
    >
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <Chip
            label={notification.Type}
            color={chipColors[notification.Type] || "default"}
            size="small"
          />

          <Typography
            variant="caption"
            color="text.secondary"
          >
            {notification.Timestamp}
          </Typography>
        </Stack>

        <Typography
          variant="body1"
          fontWeight={500}
        >
          {notification.Message}
        </Typography>
      </CardContent>
    </Card>
  );
}