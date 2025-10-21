import React, {useRef} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {HeroSection} from './components/HeroSection';
import {TLDRCard} from './components/TLDRCard';
import {LegalSection} from './components/LegalSection';
import {CalloutBox} from './components/CalloutBox';
import {ComparisonTable} from './components/ComparisonTable';
import {haptics} from '../../utils/haptics';

export const TermsOfServiceScreen: React.FC = () => {
  const navigation = useNavigation();
  const scrollViewRef = useRef<ScrollView>(null);

  const handleBack = () => {
    haptics.light();
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        <HeroSection version="2.0" lastUpdate="20 octobre 2025" />

        <TLDRCard />

        {/* Section 1: Acceptation */}
        <LegalSection
          id="acceptance"
          number="1"
          icon="✅"
          iconBackground="#50C878"
          title="Acceptation des Conditions"
          readTime="1 min"
          important>
          <CalloutBox
            type="info"
            icon="ℹ️"
            text="En utilisant Yams Score, tu acceptes ces conditions. Si tu n'es pas d'accord, n'utilise pas l'app."
          />

          <Text style={styles.paragraph}>
            Ces Conditions d'Utilisation ("Conditions") constituent un accord
            entre toi et Yams Score ("nous", "notre"). Elles définissent comment
            tu peux utiliser notre application mobile.
          </Text>

          <Text style={styles.paragraph}>
            En téléchargeant, installant ou utilisant l'app, tu confirmes que :
          </Text>

          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Tu as lu ces Conditions</Text>
            <Text style={styles.bulletItem}>• Tu les comprends</Text>
            <Text style={styles.bulletItem}>• Tu les acceptes</Text>
            <Text style={styles.bulletItem}>
              • Tu as au moins 13 ans (ou l'âge légal dans ton pays)
            </Text>
          </View>

          <CalloutBox
            type="warning"
            icon="⚠️"
            text="Si tu es mineur, demande à un parent de lire ces conditions avec toi."
          />
        </LegalSection>

        {/* Section 2: Licence */}
        <LegalSection
          id="license"
          number="2"
          icon="📜"
          iconBackground="#4A90E2"
          title="Licence d'Utilisation"
          readTime="2 min">
          <Text style={styles.subsectionTitle}>Ce qu'on te donne</Text>

          <View style={styles.grantCard}>
            <Text style={styles.paragraph}>
              Nous te donnons une licence <Text style={styles.bold}>gratuite,
              non-exclusive, révocable</Text> pour utiliser Yams Score sur ton
              appareil personnel.
            </Text>

            <View style={styles.termsList}>
              <View style={styles.termItem}>
                <Text style={styles.termIcon}>🆓</Text>
                <View style={styles.termContent}>
                  <Text style={styles.termName}>Gratuite</Text>
                  <Text style={styles.termMeaning}>Tu ne paies rien</Text>
                </View>
              </View>

              <View style={styles.termItem}>
                <Text style={styles.termIcon}>👥</Text>
                <View style={styles.termContent}>
                  <Text style={styles.termName}>Non-exclusive</Text>
                  <Text style={styles.termMeaning}>
                    D'autres personnes peuvent aussi l'utiliser
                  </Text>
                </View>
              </View>

              <View style={styles.termItem}>
                <Text style={styles.termIcon}>🔄</Text>
                <View style={styles.termContent}>
                  <Text style={styles.termName}>Révocable</Text>
                  <Text style={styles.termMeaning}>
                    On peut la retirer si tu violes ces conditions
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <Text style={styles.subsectionTitle}>Tu peux :</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>
              ✅ Télécharger et installer l'app
            </Text>
            <Text style={styles.bulletItem}>
              ✅ Utiliser toutes les fonctionnalités
            </Text>
            <Text style={styles.bulletItem}>
              ✅ Créer et jouer des parties illimitées
            </Text>
            <Text style={styles.bulletItem}>
              ✅ Partager tes scores sur les réseaux
            </Text>
          </View>

          <Text style={styles.subsectionTitle}>Tu ne peux pas :</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>
              🚫 Copier, modifier ou distribuer l'app
            </Text>
            <Text style={styles.bulletItem}>
              🚫 Reverse engineer (décoder le code)
            </Text>
            <Text style={styles.bulletItem}>
              🚫 Créer une app dérivée
            </Text>
            <Text style={styles.bulletItem}>
              🚫 Retirer les mentions de copyright
            </Text>
          </View>

          <CalloutBox
            type="danger"
            icon="⚠️"
            text="Violation = Résiliation immédiate de ta licence"
          />
        </LegalSection>

        {/* Section 3: Compte */}
        <LegalSection
          id="account"
          number="3"
          icon="👤"
          iconBackground="#9B59B6"
          title="Ton Compte"
          readTime="1 min">
          <CalloutBox
            type="success"
            icon="✅"
            text="Yams Score ne nécessite pas de compte utilisateur. Tes données sont stockées localement sur ton appareil."
          />

          <Text style={styles.subsectionTitle}>Avantages :</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>✅ Aucune inscription</Text>
            <Text style={styles.bulletItem}>
              ✅ Pas de mot de passe à retenir
            </Text>
            <Text style={styles.bulletItem}>✅ Vie privée maximale</Text>
            <Text style={styles.bulletItem}>✅ Utilisation immédiate</Text>
          </View>

          <Text style={styles.subsectionTitle}>Ta Responsabilité :</Text>
          <Text style={styles.paragraph}>
            💾 <Text style={styles.bold}>Sauvegarde :</Text> Tu es responsable
            de sauvegarder tes données. Nous te recommandons d'exporter
            régulièrement ton historique.
          </Text>
          <Text style={styles.paragraph}>
            📱 <Text style={styles.bold}>Sécurité de l'Appareil :</Text> Protège
            ton appareil (code PIN, Face ID, etc.). Si quelqu'un y accède, il
            peut voir tes parties.
          </Text>
        </LegalSection>

        {/* Section 4: Contenu Utilisateur */}
        <LegalSection
          id="user-content"
          number="4"
          icon="🎲"
          iconBackground="#50C878"
          title="Contenu Utilisateur"
          readTime="2 min">
          <Text style={styles.subsectionTitle}>Qui Possède Quoi</Text>

          <View style={styles.ownershipCard}>
            <Text style={styles.ownershipTitle}>
              👤 Ton Contenu (Tu Possèdes)
            </Text>
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>• Tes parties de Yams</Text>
              <Text style={styles.bulletItem}>• Tes scores</Text>
              <Text style={styles.bulletItem}>• Tes statistiques</Text>
              <Text style={styles.bulletItem}>
                • Ton profil (pseudo, avatar)
              </Text>
              <Text style={styles.bulletItem}>• Tes préférences</Text>
            </View>
            <CalloutBox
              type="success"
              icon="✅"
              text="Ces données t'appartiennent à 100%. Tu peux les exporter ou les supprimer à tout moment."
            />
          </View>

          <View style={styles.ownershipCard}>
            <Text style={styles.ownershipTitle}>
              ©️ Notre Contenu (On Possède)
            </Text>
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>• Le code de l'app</Text>
              <Text style={styles.bulletItem}>• Le design et interface</Text>
              <Text style={styles.bulletItem}>• Le logo et assets</Text>
              <Text style={styles.bulletItem}>• Les algorithmes</Text>
              <Text style={styles.bulletItem}>• La marque "Yams Score"</Text>
            </View>
            <Text style={styles.copyright}>
              © 2025 Yams Score. Tous droits réservés.
            </Text>
          </View>
        </LegalSection>

        {/* Section 5: Usages Interdits */}
        <LegalSection
          id="prohibited"
          number="5"
          icon="🚫"
          iconBackground="#FF6B6B"
          title="Usages Interdits"
          readTime="2 min"
          important>
          <CalloutBox
            type="danger"
            icon="⚠️"
            text="Ces actions peuvent entraîner la suspension de ton accès à l'app."
          />

          <Text style={styles.subsectionTitle}>🔒 Sécurité & Technique</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>
              🚫 Hacking ou piratage de l'app
            </Text>
            <Text style={styles.bulletItem}>
              🚫 Modification ou décompilation du code
            </Text>
            <Text style={styles.bulletItem}>
              🚫 Automatisation abusive (bots, scripts)
            </Text>
          </View>

          <Text style={styles.subsectionTitle}>💰 Utilisation Commerciale</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>🚫 Revente ou location de l'app</Text>
            <Text style={styles.bulletItem}>
              🚫 Publicité non autorisée
            </Text>
            <Text style={styles.bulletItem}>
              🚫 Créer un service commercial
            </Text>
          </View>

          <Text style={styles.subsectionTitle}>🤝 Comportement</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>
              🚫 Harcèlement d'autres utilisateurs (Tolérance zéro)
            </Text>
            <Text style={styles.bulletItem}>
              🚫 Contenu inapproprié ou offensant
            </Text>
            <Text style={styles.bulletItem}>
              🚫 Discrimination ou messages de haine
            </Text>
          </View>
        </LegalSection>

        {/* Section 6: Responsabilité */}
        <LegalSection
          id="liability"
          number="6"
          icon="⚖️"
          iconBackground="#F39C12"
          title="Responsabilité"
          readTime="3 min"
          important>
          <Text style={styles.paragraph}>
            Cette section explique nos responsabilités respectives. C'est du
            légal standard, mais on t'explique en français simple.
          </Text>

          <Text style={styles.subsectionTitle}>Service "Tel Quel"</Text>

          <View style={styles.legalBox}>
            <Text style={styles.legalText}>
              L'APP EST FOURNIE "TELLE QUELLE" ET "SELON DISPONIBILITÉ" SANS
              GARANTIE D'AUCUNE SORTE.
            </Text>
          </View>

          <Text style={styles.subsectionTitle}>🔄 En français simple :</Text>
          <Text style={styles.paragraph}>
            On fait de notre mieux pour que l'app fonctionne parfaitement, mais
            on ne peut pas garantir :
          </Text>

          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>
              • Fonctionnement sans bug (on les corrige vite)
            </Text>
            <Text style={styles.bulletItem}>
              • Disponibilité 100% (maintenance possible)
            </Text>
            <Text style={styles.bulletItem}>
              • Compatibilité totale (appareils anciens)
            </Text>
          </View>

          <CalloutBox
            type="success"
            icon="💪"
            text="Notre engagement : On travaille dur pour offrir la meilleure expérience possible."
          />

          <Text style={styles.subsectionTitle}>
            Ce dont on est responsable :
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>
              ✅ Bugs critiques non corrigés rapidement
            </Text>
            <Text style={styles.bulletItem}>
              ✅ Perte de données due à un problème de notre côté
            </Text>
            <Text style={styles.bulletItem}>
              ✅ Problèmes de sécurité non corrigés
            </Text>
          </View>

          <Text style={styles.subsectionTitle}>
            Ce dont on n'est PAS responsable :
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>
              🚫 Perte de données si tu n'as pas sauvegardé
            </Text>
            <Text style={styles.bulletItem}>
              🚫 Problèmes dus à ton appareil défectueux
            </Text>
            <Text style={styles.bulletItem}>
              🚫 Mauvaise utilisation de l'app
            </Text>
            <Text style={styles.bulletItem}>
              🚫 Problèmes de connexion internet
            </Text>
          </View>
        </LegalSection>

        {/* Tableau de Comparaison */}
        <ComparisonTable />

        {/* Section 7: Contact */}
        <LegalSection
          id="contact"
          number="7"
          icon="📧"
          iconBackground="#50C878"
          title="Nous Contacter"
          readTime="30 sec">
          <Text style={styles.paragraph}>
            Des questions sur ces Conditions ? On est là pour t'aider.
          </Text>

          <View style={styles.contactCard}>
            <Text style={styles.contactType}>⚖️ Questions Légales</Text>
            <Text style={styles.contactEmail}>legal@yams-score.app</Text>
            <Text style={styles.contactTime}>Réponse sous 5 jours ouvrés</Text>
          </View>

          <View style={styles.contactCard}>
            <Text style={styles.contactType}>💬 Support Général</Text>
            <Text style={styles.contactEmail}>support@yams-score.app</Text>
            <Text style={styles.contactTime}>Réponse sous 48h</Text>
          </View>
        </LegalSection>

        {/* Footer Spacer */}
        <View style={styles.footerSpacer} />
      </ScrollView>

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleBack}
        activeOpacity={0.7}>
        <Text style={styles.backButtonText}>← Retour</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  paragraph: {
    fontFamily: 'SF Pro Text',
    fontSize: 16,
    fontWeight: '400',
    color: '#333333',
    lineHeight: 24,
    marginBottom: 12,
  },
  subsectionTitle: {
    fontFamily: 'SF Pro Text',
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginTop: 16,
    marginBottom: 8,
  },
  bold: {
    fontWeight: '700',
  },
  bulletList: {
    marginBottom: 12,
  },
  bulletItem: {
    fontFamily: 'SF Pro Text',
    fontSize: 15,
    fontWeight: '400',
    color: '#333333',
    lineHeight: 24,
    marginBottom: 6,
  },
  grantCard: {
    backgroundColor: 'rgba(80, 200, 120, 0.05)',
    borderWidth: 2,
    borderColor: 'rgba(80, 200, 120, 0.3)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  termsList: {
    marginTop: 12,
  },
  termItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  termIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  termContent: {
    flex: 1,
  },
  termName: {
    fontFamily: 'SF Pro Text',
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  termMeaning: {
    fontFamily: 'SF Pro Text',
    fontSize: 14,
    fontWeight: '400',
    color: '#666666',
  },
  ownershipCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  ownershipTitle: {
    fontFamily: 'SF Pro Text',
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  copyright: {
    fontFamily: 'SF Pro Text',
    fontSize: 13,
    fontWeight: '400',
    color: '#999999',
    fontStyle: 'italic',
    marginTop: 8,
  },
  legalBox: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 12,
    marginVertical: 12,
  },
  legalText: {
    fontFamily: 'SF Pro Text',
    fontSize: 14,
    fontWeight: '400',
    color: '#666666',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  contactCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  contactType: {
    fontFamily: 'SF Pro Text',
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  contactEmail: {
    fontFamily: 'SF Pro Text',
    fontSize: 15,
    fontWeight: '500',
    color: '#4A90E2',
    marginBottom: 4,
  },
  contactTime: {
    fontFamily: 'SF Pro Text',
    fontSize: 13,
    fontWeight: '400',
    color: '#999999',
  },
  footerSpacer: {
    height: 80,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  backButtonText: {
    fontFamily: 'SF Pro Text',
    fontSize: 16,
    fontWeight: '600',
    color: '#4A90E2',
  },
});
