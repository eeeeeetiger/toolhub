import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'jwt-decoder',
  name: 'JWT Decoder',
  description:
    'Decode JSON Web Tokens (JWT) and inspect the header and payload. No verification, fully client-side.',
  longDescription:
    'JWT Decoder parses a JSON Web Token and shows its decoded header and payload as readable JSON. It does not verify signatures — it is meant for inspecting tokens during development and debugging. Paste a token, and the three parts (header, payload, signature) are split and decoded instantly in your browser.',
  category: 'developer',
  keywords: ['jwt decoder', 'decode jwt', 'jwt parser', 'json web token decoder', 'inspect jwt'],
  icon: 'Code',
  isClientOnly: true,
  features: ['Decode header & payload', 'Pretty JSON', 'No signature check', 'Private & instant'],
  relatedTools: ['base64', 'json-formatter'],
};
