import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

interface EmailTemplateProps {
  subject?: string;
  content: string;
  logoUrl: string;
}

export const EmailTemplate = ({
  content,
  logoUrl,
  subject = "Important Message",
}: EmailTemplateProps) => (
  <Html>
    <Head>
      <title>{subject}</title>
    </Head>
    <Tailwind>
      <Body className="bg-white font-sans">
        <Preview>{subject}</Preview>
        <Container className="mx-auto my-0 px-4 py-8">
          {/* Logo Header */}
          <Section className="mt-4 w-full flex items-center justify-center mb-6 text-center">
            <Img
              src={logoUrl}
              width="120"
              height="auto"
              alt="Company Logo"
              className=""
            />
          </Section>

          {/* Email Content */}
          <Section className="mb-6">
            <Text className="text-2xl font-bold text-gray-900 mb-4">
              {subject}
            </Text>
            <Text
              className="text-base leading-6 text-gray-900"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </Section>
          <Section className="mb-6">
            <Text className="text-sm text-gray-900">
              If you have any questions, feel free to reach out to us.
            </Text>
          </Section>
          <Section className="">
            <Text className="text-sm text-gray-900">
              Best regards,
              <br />
              The Syrena Team
            </Text>
          </Section>
          <Section>
            <Button
              href="https://www.linkedin.com/company/syrenaa/posts/?feedView=all"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-300  "
            >
              Contact Us
            </Button>
          </Section>

          {/* Footer */}
          <Hr className="border-t border-gray-200 my-6" />
          <Section className="text-center text-xs text-gray-500">
            <Text>
              © {new Date().getFullYear()} Your Company. All rights reserved.
            </Text>
            <Text className="mt-1">
              Address Line 1 • City, State ZIP • Country
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default EmailTemplate;
