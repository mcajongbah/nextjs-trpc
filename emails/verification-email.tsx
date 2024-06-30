import {
    Body,
    Button,
    Container,
    Head,
    Html,
    Link,
    Text,
} from "@react-email/components";

export const VerificationEmail = ({
  verificationLink,
}: {
  verificationLink: string;
}) => (
  <Html>
    <Head />
    <Body style={{ fontFamily: "Arial, sans-serif" }}>
      <Container>
        <Text>Welcome! Please verify your email address.</Text>
        <Button
          href={verificationLink}
          style={{
            background: "#007bff",
            color: "white",
            padding: "10px 20px",
          }}
        >
          Verify Email
        </Button>
        <Text>
          Or copy and paste this link:{" "}
          <Link href={verificationLink}>{verificationLink}</Link>
        </Text>
      </Container>
    </Body>
  </Html>
);
