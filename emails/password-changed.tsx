import {
  Button,
  Html,
  Head,
  Body,
  Container,
  Text,
  Link,
} from "@react-email/components";

interface PasswordChangedEmailProps {
  loginLink: string;
  supportEmail: string;
}

export const PasswordChangedEmail = ({
  loginLink,
  supportEmail,
}: PasswordChangedEmailProps) => (
  <Html>
    <Head />
    <Body style={{ fontFamily: "Arial, sans-serif" }}>
      <Container>
        <Text>Your password has been successfully changed.</Text>
        <Text>
          If you made this change, you don&apos;t need to do anything else. You
          can now log in with your new password.
        </Text>
        <Button
          href={loginLink}
          style={{
            background: "#007bff",
            color: "white",
            padding: "10px 20px",
          }}
        >
          Log In
        </Button>
        <Text>
          Or copy and paste this link to log in:{" "}
          <Link href={loginLink}>{loginLink}</Link>
        </Text>
        <Text>
          If you didn&apos;t change your password, please contact our support
          team immediately at{" "}
          <Link href={`mailto:${supportEmail}`}>{supportEmail}</Link>.
        </Text>
        <Text>
          For security reasons, we recommend changing your password if you
          suspect any unauthorized access to your account.
        </Text>
      </Container>
    </Body>
  </Html>
);
