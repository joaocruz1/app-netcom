// app/(tabs)/(home)/perfil.tsx

import React from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert
} from 'react-native';
import { useRouter, usePathname, Stack } from 'expo-router';
import { MaterialIcons, Feather, Ionicons,MaterialCommunityIcons } from '@expo/vector-icons';

// 1. Definindo a paleta de cores que será usada na tela
const palette = {
    'netcom-blue': '#0A2F5B',
    'netcom-orange': '#FF6600',
    'netcom-background': '#F9FAFB',
    'netcom-card-bg': '#FFFFFF',
    'netcom-input-border': '#D1D5DB',
    'netcom-text-primary': '#111827',
    'netcom-text-secondary': '#6B7280',
    'netcom-placeholder': '#9CA3AF'
};

export default function PerfilScreen() {
    const router = useRouter();
    const pathname = usePathname();

    // 2. Estrutura de dados para os itens do menu. Facilita a manutenção.
    const profileSections = [
        {
            title: 'Conta',
            items: [
                { id: 'email', label: 'Alterar e-mail', icon: 'mail-outline', path: '/(profile)/alterar-email'},
                { id: 'password', label: 'Alterar senha', icon: 'lock-outline', path: '/(profile)/alterar-senha'},
                { id: 'cards', label: 'Meus cartões', icon: 'card-outline', path: '/(profile)/meus-cards'},
            ]
        },
        {
            title: 'Mais opções',
            items: [
                { id: 'support', label: 'Atendimento', icon: 'headset-outline', path: '/support' },
                { id: 'terms', label: 'Termos e condições', icon: 'reader-outline', path: '/terms' },
                { id: 'logout', label: 'Sair', icon: 'log-out-outline', action: 'logout', color: '#EF4444' }, // Cor especial para 'Sair'
            ]
        }
    ];

    // Função para lidar com o clique em um item
    const handlePress = (item: { action?: string, path?: string }) => {
        if (item.action === 'logout') {
            Alert.alert(
                "Sair da conta",
                "Você tem certeza que deseja sair?",
                [
                    { text: "Cancelar", style: "cancel" },
                    { text: "Sair", onPress: () => console.log("Usuário deslogado"), style: "destructive" },
                ]
            );
        } else if (item.path) {
            router.push(item.path as any);
        }
    };

    const BottomNavBar = () => {
        const navItems = [
            { icon: 'home', label: 'Início', type: 'MaterialIcons', path: '/(tabs)/(home)' },
            { icon: 'shopping-bag', label: 'Loja', type: 'FontAwesome', path: '/(tabs)/(home)/loja' },
            { icon: 'account', label: 'Perfil', type: 'MaterialCommunityIcons', path: '/(tabs)/(home)/perfil' }
        ] as const;

        return (
            <View style={styles.navContainer}>
                {navItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <TouchableOpacity key={item.path} style={styles.navButton} onPress={() => router.push(item.path)}>
                            {item.type === 'MaterialIcons' && <MaterialIcons name={item.icon as any} size={26} color={isActive ? palette['netcom-blue'] : palette['netcom-placeholder']} />}
                            {item.type === 'FontAwesome' && <Feather name={item.icon as any} size={24} color={isActive ? palette['netcom-blue'] : palette['netcom-placeholder']} />}
                            {item.type === 'MaterialCommunityIcons' && <MaterialCommunityIcons name={item.icon as any} size={26} color={isActive ? palette['netcom-blue'] : palette['netcom-placeholder']} />}
                            <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{item.label}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen
                options={{
                    headerStyle: { backgroundColor: palette['netcom-orange'] },
                    headerTitle: () => (
                        // Substitua o ícone pelo seu componente de Logo
                        <Ionicons name="person-outline" size={28} color="white" />
                    ),
                    headerTitleAlign: 'center',
                }}
            />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {profileSections.map(section => (
                    <View key={section.title} style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>{section.title.toUpperCase()}</Text>
                        <View style={styles.card}>
                            {section.items.map((item, index) => (
                                <TouchableOpacity key={item.id} style={styles.optionRow} onPress={() => handlePress(item)}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Ionicons name={item.icon as any} size={24} color={item.color || palette['netcom-text-secondary']} />
                                        <Text style={[styles.optionText, { color: item.color || palette['netcom-text-primary'] }]}>
                                            {item.label}
                                        </Text>
                                    </View>
                                    <MaterialIcons name="keyboard-arrow-right" size={24} color={palette['netcom-text-secondary']} />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                ))}
                <Text style={styles.versionText}>App NetCom 5G v1.00.0</Text>
            </ScrollView>
            <BottomNavBar />
        </SafeAreaView>
    );
}

// 3. Estilos baseados na paleta de cores e no design da imagem
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: palette['netcom-background'],
    },
    scrollContainer: {
        padding: 16,
    },
    sectionContainer: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: palette['netcom-text-secondary'],
        letterSpacing: 0.5,
        marginBottom: 8,
        paddingHorizontal: 8,
    },
    card: {
        backgroundColor: palette['netcom-card-bg'],
        borderRadius: 12,
        overflow: 'hidden', // Garante que os filhos respeitem o border radius
    },
    optionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: palette['netcom-background'], // Usa a cor de fundo para a linha
    },
    optionText: {
        fontSize: 16,
        marginLeft: 16,
    },
    versionText: {
        textAlign: 'center',
        color: palette['netcom-text-secondary'],
        fontSize: 12,
        marginTop: 24,
        marginBottom: 16,
    },
    navContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: palette['netcom-input-border'],
        backgroundColor: palette['netcom-card-bg'],
    },
    navButton: {
        alignItems: 'center',
        padding: 4,
        flex: 1,
    },
    navLabel: {
        fontSize: 12,
        color: palette['netcom-placeholder'],
        marginTop: 5,
        fontWeight: '500',
    },
    navLabelActive: {
        color: palette['netcom-blue'],
        fontWeight: '600',
    },
});