export interface ContactEmailConfig {
  readonly resendApiKey: string;
  readonly toEmail: string;
  readonly fromEmail: string;
}

type ContactEmailEnv = Record<string, string | undefined>;

const getRequiredEnvValue = (
  env: ContactEmailEnv,
  key: keyof ContactEmailEnv
): string => {
  const value = env[key]?.trim();

  if (!value) {
    throw new Error("Missing contact email configuration");
  }

  return value;
};

export const getContactEmailConfig = (
  env: ContactEmailEnv = process.env
): ContactEmailConfig => {
  return {
    resendApiKey: getRequiredEnvValue(env, "RESEND_API_KEY"),
    toEmail: getRequiredEnvValue(env, "CONTACT_TO_EMAIL"),
    fromEmail: getRequiredEnvValue(env, "CONTACT_FROM_EMAIL"),
  };
};
