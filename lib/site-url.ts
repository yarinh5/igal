/** Metadata follows the deployment; SITE_URL optionally selects a custom domain. */
export function getSiteUrl() {
  const host=process.env.VERCEL_PROJECT_PRODUCTION_URL||process.env.VERCEL_URL;
  return new URL(process.env.SITE_URL||(host?`https://${host}`:'http://localhost:3000'));
}
