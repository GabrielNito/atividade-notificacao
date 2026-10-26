
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  async function enviarNotificacao() {
    try {
      await Notifications.setNotificationChannelAsync('padrao', {
        name: 'Notificações',
        importance: Notifications.AndroidImportance.HIGH,
      });

      const permissao = await Notifications.requestPermissionsAsync();

      if (!permissao.granted) {
        Alert.alert('Permissão negada');
        return;
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Olá!',
          body: 'Esta é uma notificação de teste.',
        },
        trigger: null,
      });
    } catch (erro) {
      Alert.alert('Erro ao enviar', String(erro));
    }
  }

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 24 }}>Notificações</Text>

      <Button
        title="Enviar notificação"
        onPress={enviarNotificacao}
      />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
});
