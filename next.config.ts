import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  env: {
    NEXT_INTL_CONFIG: './next-intl.config.ts'
  }
};

export default nextConfig;
