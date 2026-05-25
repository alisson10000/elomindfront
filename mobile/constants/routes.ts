export const ROUTES = {
  auth: {
    login: "/(auth)/login",
    forgotPassword: "/(auth)/forgot-password",
    resetPassword: "/(auth)/reset-password",
    inviteCode: "/(auth)/invite-code",
    inviteSignup: "/(auth)/invite-signup",
    consentLgpd: "/(auth)/consent-lgpd",
  },
  client: {
    tabsHome: "/(client)/(tabs)/client-home",
    tabsRoot: "/(client)",
    profile: "/(client)/(tabs)/profile",
    reflections: "/(client)/reflections",
    newReflection: "/(client)/reflections/new",
    dreamsNew: "/(client)/dreams/new",
    privacy: "/(client)/privacy",
  },
  therapist: {
    tabsHome: "/(therapist)/(tabs)/therapist-home",
    profile: "/(therapist)/(tabs)/profile",
    clients: "/(therapist)/client",
    reflections: "/(therapist)/reflections",
    feedbacks: "/(therapist)/feedbacks",
    inviteClient: "/(therapist)/invite-client",
    dreams: "/(therapist)/dreams",
    deleteClientLgpd: "/(therapist)/lgpd/delete-client",
  },
} as const;
