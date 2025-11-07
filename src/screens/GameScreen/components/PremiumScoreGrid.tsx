import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Player, PlayerScores, CategoryType, CATEGORIES, ActiveCell } from '../../../types/game';
import PlayerHeader from './PlayerHeader';
import ScoreCell from './ScoreCell';

interface PremiumScoreGridProps {
  players: Player[];
  scores: Record<string, PlayerScores>;
  currentPlayerIndex: number;
  activeCell: ActiveCell | null;
  onCellPress: (playerId: string, category: CategoryType) => void;
}

const PremiumScoreGrid: React.FC<PremiumScoreGridProps> = ({
  players,
  scores,
  currentPlayerIndex,
  activeCell,
  onCellPress,
}) => {
  const currentPlayer = players[currentPlayerIndex];

  // Calculer la largeur dynamique des colonnes
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenWidth(window.width);
    });

    return () => subscription?.remove();
  }, []);

  const LABEL_WIDTH = 140;
  const availableWidth = screenWidth - LABEL_WIDTH;
  const playerColumnWidth = Math.floor(availableWidth / players.length);

  // Calculate positions
  const getPlayerPosition = (playerId: string): number => {
    const sortedPlayers = [...players].sort((a, b) => {
      const scoreA = scores[a.id]?.grandTotal || 0;
      const scoreB = scores[b.id]?.grandTotal || 0;
      return scoreB - scoreA;
    });

    return sortedPlayers.findIndex((p) => p.id === playerId) + 1;
  };

  const renderLabelCell = (label: string, icon?: string, isTotal: boolean = false) => (
    <View style={[styles.labelCell, isTotal && styles.labelCellTotal]}>
      {isTotal ? (
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.2)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.labelGradient}
        >
          {icon && <Text style={styles.labelIcon}>{icon}</Text>}
          <Text
            style={[styles.labelText, styles.labelTextTotal]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
          >
            {label}
          </Text>
        </LinearGradient>
      ) : (
        <>
          {icon && <Text style={styles.labelIcon}>{icon}</Text>}
          <Text
            style={styles.labelText}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
          >
            {label}
          </Text>
        </>
      )}
    </View>
  );

  const renderTotalCell = (value: number, playerId: string, isBonusCell: boolean = false) => {
    const player = players.find((p) => p.id === playerId);

    if (isBonusCell) {
      // BONUS CELL - Ultra premium golden style
      return (
        <View style={[styles.bonusCellContainer, { width: playerColumnWidth }]}>
          <LinearGradient
            colors={value > 0 ? ['#FFD700', '#FFC700', '#FFB300', '#FFA000'] : ['#F5F5F5', '#E8E8E8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.bonusCell, value === 0 && styles.bonusCellEmpty]}
          >
            <View style={styles.bonusContentContainer}>
              {value > 0 && (
                <>
                  <View style={styles.bonusSparkleTop}>
                    <Text style={styles.bonusSparkle}>✨</Text>
                  </View>
                  <View style={styles.bonusSparkleBottom}>
                    <Text style={styles.bonusSparkle}>✨</Text>
                  </View>
                </>
              )}
              <Text style={[styles.bonusText, value === 0 && styles.bonusTextEmpty]}>
                {value}
              </Text>
              {value > 0 && (
                <View style={styles.bonusStarContainer}>
                  <Text style={styles.bonusStar}>🎁</Text>
                </View>
              )}
              {value > 0 && <View style={styles.bonusShine} />}
            </View>
          </LinearGradient>
        </View>
      );
    }

    // TOTAL CELL - Premium colored style
    return (
      <View style={[styles.totalCellContainer, { width: playerColumnWidth }]}>
        <LinearGradient
          colors={[`${player?.color || '#4A90E2'}70`, `${player?.color || '#4A90E2'}50`, `${player?.color || '#4A90E2'}30`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.totalCell}
        >
          <View style={styles.totalContentContainer}>
            <Text style={styles.totalText}>{value}</Text>
            <View style={styles.totalShine} />
            <View style={styles.totalGlowTop} />
          </View>
        </LinearGradient>
      </View>
    );
  };

  const renderGrandTotalCell = (value: number, playerId: string) => {
    const position = getPlayerPosition(playerId);
    const player = players.find((p) => p.id === playerId);

    return (
      <View style={[styles.grandTotalCellContainer, { width: playerColumnWidth }]}>
        <LinearGradient
          colors={
            position === 1
              ? ['#FFD700', '#FFB300', '#FF8F00']
              : [player?.color || '#4A90E2', `${player?.color || '#4A90E2'}CC`, `${player?.color || '#4A90E2'}99`]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.grandTotalCell,
            position === 1 && styles.grandTotalCellLeader,
          ]}
        >
          <View style={styles.grandTotalContentContainer}>
            <Text style={styles.grandTotalText}>{value}</Text>
            {position === 1 && <Text style={styles.crownIcon}>👑</Text>}
            <View style={styles.grandTotalShine} />
          </View>
        </LinearGradient>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalScroll}
      >
        <View style={styles.gridContainer}>
          {/* Player headers row */}
          <View style={styles.headerRow}>
            <View style={[styles.labelColumnHeader, { width: LABEL_WIDTH }]}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.2)']}
                style={styles.headerGradient}
              >
                <Text style={styles.headerLabel}>Catégories</Text>
              </LinearGradient>
            </View>
            {players.map((player) => (
              <PlayerHeader
                key={player.id}
                player={player}
                grandTotal={scores[player.id]?.grandTotal || 0}
                position={getPlayerPosition(player.id)}
                isActive={player.id === currentPlayer.id}
                columnWidth={playerColumnWidth}
              />
            ))}
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.verticalScroll}
          >
            {/* Upper section */}
            {CATEGORIES.filter((c) => c.section === 'upper').map((category, index) => (
              <View
                key={category.id}
                style={[
                  styles.row,
                  index % 2 === 0 && styles.rowEven,
                ]}
              >
                {renderLabelCell(category.shortName, category.icon)}
                {players.map((player) => (
                  <ScoreCell
                    key={player.id}
                    entry={scores[player.id]?.[category.id]}
                    playerColor={player.color}
                    isActive={
                      activeCell?.playerId === player.id &&
                      activeCell?.category === category.id
                    }
                    isLocked={player.id !== currentPlayer.id}
                    isPlayerTurn={player.id === currentPlayer.id}
                    onPress={() => onCellPress(player.id, category.id)}
                    columnWidth={playerColumnWidth}
                  />
                ))}
              </View>
            ))}

            {/* Bonus row */}
            <View style={styles.row}>
              {renderLabelCell('BONUS', '🎁', true)}
              {players.map((player) => (
                <React.Fragment key={player.id}>
                  {renderTotalCell(scores[player.id]?.upperBonus || 0, player.id, true)}
                </React.Fragment>
              ))}
            </View>

            {/* Upper total row */}
            <View style={styles.row}>
              {renderLabelCell('TOTAL ↑', '📊', true)}
              {players.map((player) => {
                const upperTotal = scores[player.id]?.upperTotal || 0;
                const upperBonus = scores[player.id]?.upperBonus || 0;
                const totalWithBonus = upperTotal + upperBonus;
                return (
                  <React.Fragment key={player.id}>
                    {renderTotalCell(totalWithBonus, player.id)}
                  </React.Fragment>
                );
              })}
            </View>

            {/* Separator */}
            <View style={styles.separator}>
              <LinearGradient
                colors={['#E1E8ED', '#BDC3C7', '#E1E8ED']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.separatorGradient}
              />
            </View>

            {/* Lower section */}
            {CATEGORIES.filter((c) => c.section === 'lower').map((category, index) => (
              <View
                key={category.id}
                style={[
                  styles.row,
                  index % 2 === 0 && styles.rowEven,
                ]}
              >
                {renderLabelCell(category.shortName, category.icon)}
                {players.map((player) => (
                  <ScoreCell
                    key={player.id}
                    entry={scores[player.id]?.[category.id]}
                    playerColor={player.color}
                    isActive={
                      activeCell?.playerId === player.id &&
                      activeCell?.category === category.id
                    }
                    isLocked={player.id !== currentPlayer.id}
                    isPlayerTurn={player.id === currentPlayer.id}
                    onPress={() => onCellPress(player.id, category.id)}
                    columnWidth={playerColumnWidth}
                  />
                ))}
              </View>
            ))}

            {/* Lower total row */}
            <View style={styles.row}>
              {renderLabelCell('TOTAL ↓', '📊', true)}
              {players.map((player) => (
                <React.Fragment key={player.id}>
                  {renderTotalCell(scores[player.id]?.lowerTotal || 0, player.id)}
                </React.Fragment>
              ))}
            </View>

            {/* Separator */}
            <View style={styles.separator}>
              <LinearGradient
                colors={['#E1E8ED', '#BDC3C7', '#E1E8ED']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.separatorGradient}
              />
            </View>

            {/* Grand total row */}
            <View style={styles.row}>
              {renderLabelCell('🏆 TOTAL', '', true)}
              {players.map((player) => (
                <React.Fragment key={player.id}>
                  {renderGrandTotalCell(scores[player.id]?.grandTotal || 0, player.id)}
                </React.Fragment>
              ))}
            </View>

            {/* Spacing at bottom */}
            <View style={styles.spacer} />
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  horizontalScroll: {
    flex: 1,
  },
  gridContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  labelColumnHeader: {
    overflow: 'hidden',
  },
  headerGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  headerLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  verticalScroll: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  rowEven: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  labelCell: {
    width: 140,
    height: 56,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRightWidth: 2,
    borderRightColor: 'rgba(255, 255, 255, 0.3)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 8,
  },
  labelCellTotal: {
    height: 64,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(255, 255, 255, 0.4)',
    overflow: 'hidden',
  },
  labelGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 6,
    paddingHorizontal: 8,
  },
  labelIcon: {
    fontSize: 18,
    flexShrink: 0,
  },
  labelText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    flexShrink: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  labelTextTotal: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  // BONUS CELL STYLES - Ultra Premium Golden
  bonusCellContainer: {
    height: 72,
    padding: 3,
  },
  bonusCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 6,
    borderColor: '#FF8F00',
    position: 'relative',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.9,
    shadowRadius: 20,
    elevation: 20,
    overflow: 'hidden',
  },
  bonusCellEmpty: {
    borderWidth: 3,
    borderColor: '#CCCCCC',
    shadowColor: '#999999',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  bonusContentContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  bonusText: {
    fontSize: 36,
    fontWeight: '900',
    color: '#BF360C',
    fontFamily: 'System',
    textShadowColor: 'rgba(255, 235, 59, 0.9)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 8,
    zIndex: 2,
  },
  bonusTextEmpty: {
    fontSize: 28,
    color: '#999999',
    textShadowColor: 'transparent',
  },
  bonusShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '55%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    zIndex: 1,
  },
  bonusSparkleTop: {
    position: 'absolute',
    top: 4,
    left: 6,
    zIndex: 3,
  },
  bonusSparkleBottom: {
    position: 'absolute',
    bottom: 4,
    right: 8,
    zIndex: 3,
  },
  bonusSparkle: {
    fontSize: 18,
    textShadowColor: 'rgba(255, 215, 0, 1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  bonusStarContainer: {
    position: 'absolute',
    top: -2,
    right: -2,
    zIndex: 4,
  },
  bonusStar: {
    fontSize: 24,
    textShadowColor: 'rgba(255, 152, 0, 0.9)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  // TOTAL CELL STYLES - Premium Colored
  totalCellContainer: {
    height: 68,
    padding: 3,
  },
  totalCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    borderWidth: 5,
    borderColor: 'rgba(74, 144, 226, 0.8)',
    position: 'relative',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 14,
    overflow: 'hidden',
  },
  totalContentContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  totalText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    fontFamily: 'System',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
    zIndex: 2,
  },
  totalShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    zIndex: 1,
  },
  totalGlowTop: {
    position: 'absolute',
    top: 0,
    left: '10%',
    right: '10%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 2,
    zIndex: 2,
  },
  grandTotalCellContainer: {
    height: 64,
    padding: 2,
  },
  grandTotalCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 5,
    borderColor: '#3A7BC8',
    position: 'relative',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 16,
    overflow: 'hidden',
  },
  grandTotalContentContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  grandTotalCellLeader: {
    borderColor: '#FF8F00',
    borderWidth: 6,
    shadowColor: '#FFD700',
    shadowOpacity: 0.9,
    shadowRadius: 20,
    elevation: 20,
  },
  grandTotalText: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    fontFamily: 'System',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 8,
    zIndex: 2,
  },
  grandTotalShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    zIndex: 1,
  },
  crownIcon: {
    position: 'absolute',
    top: -6,
    right: -6,
    fontSize: 28,
    zIndex: 3,
    textShadowColor: 'rgba(255, 215, 0, 0.9)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  separator: {
    height: 4,
    marginVertical: 8,
  },
  separatorGradient: {
    flex: 1,
    borderRadius: 2,
    opacity: 0.6,
  },
  spacer: {
    height: 20,
  },
});

export default PremiumScoreGrid;
