import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },

  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },

  card: {
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,

    // sombra iOS
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },

    // sombra Android
    elevation: 6,
  },

  logo: {
    width: "100%",
    height: 150,
    marginBottom: 6,
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 2,
  },

  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 18,
    lineHeight: 20,
  },

  form: {
    marginTop: 6,
  },

  label: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
  },

  labelSpacing: {
    marginTop: 14,
  },

  input: {
    height: 50,
    borderWidth: 1,
    paddingHorizontal: 14,
    borderRadius: 14,
    fontSize: 15,
  },

  button: {
    marginTop: 18,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",

    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },

  buttonPressed: {
    transform: [{ scale: 0.99 }],
    opacity: 0.95,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.2,
  },

  footer: {
    marginTop: 14,
    fontSize: 12,
    textAlign: "center",
    lineHeight: 16,
  },

  rememberRow: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
  },

  rememberText: {
    fontSize: 13,
    fontWeight: "700",
  },
});
