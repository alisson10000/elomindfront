<<<<<<< HEAD
import { Link } from "expo-router";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { styles } from "../styles/modal.styles";
=======
import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8

export default function ModalScreen() {
  return (
    <ThemedView style={styles.container}>
<<<<<<< HEAD
      <ThemedText type="title" style={styles.title}>
        This is a modal
      </ThemedText>

      <Link href="/" dismissTo style={styles.link}>
        <ThemedText type="link" style={styles.linkText}>
          Go to home screen
        </ThemedText>
      </Link>
    </ThemedView>
  );
}
=======
      <ThemedText type="title">This is a modal</ThemedText>
      <Link href="/" dismissTo style={styles.link}>
        <ThemedText type="link">Go to home screen</ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
