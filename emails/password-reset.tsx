import {
  Button,
  Html,
  Head,
  Body,
  Container,
  Text,
  Link,
} from "@react-email/components";

export const PasswordResetEmail = ({ resetLink }: { resetLink: string }) => (
  <Html>
    <Head />
    <Body style={{ fontFamily: "Arial, sans-serif" }}>
      <Container>
        <Text>
          You requested a password reset. Click the button below to reset your
          password.
        </Text>
        <Button
          href={resetLink}
          style={{
            background: "#28a745",
            color: "white",
            padding: "10px 20px",
          }}
        >
          Reset Password
        </Button>
        <Text>
          Or copy and paste this link: <Link href={resetLink}>{resetLink}</Link>
        </Text>
        <Text>
          If you didn&apos;t request a password reset, please ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
);
