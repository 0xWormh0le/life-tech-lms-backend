// Defined in Codex Master Data Sheet
// Refer: https://docs.google.com/spreadsheets/d/1hXUeCZgIUyx_liykNu6tlDJVwPu7MLKu_TIOoBwvdTo/edit#gid=0

export const lessonIdByProjectnameAndScenarioPath = (projectName: string, scenarioPath: string): string | null => {
  const scenarioName = scenarioPath.replace('lesson/', '')
  const project = lessonsMapByProjectNameAndScenarioName[projectName]
  if (!project) {
    return null
  }
  return project[scenarioName] ? project[scenarioName].id : null
}

const lessonsMapByProjectNameAndScenarioName: Record<string, Record<string, { id: string; projectName: string; scenarioName: string }>> = {
  principal: {
    g_principal_1: {
      id: 'lesson-codeillusion-basic-principal-gem-1',
      projectName: 'principal',
      scenarioName: 'g_principal_1',
    },
    g_principal_2: {
      id: 'lesson-codeillusion-basic-principal-gem-2',
      projectName: 'principal',
      scenarioName: 'g_principal_2',
    },
    g_principal_3: {
      id: 'lesson-codeillusion-basic-principal-gem-3',
      projectName: 'principal',
      scenarioName: 'g_principal_3',
    },
    g_principal_4: {
      id: 'lesson-codeillusion-basic-principal-gem-4',
      projectName: 'principal',
      scenarioName: 'g_principal_4',
    },
    g_principal_5: {
      id: 'lesson-codeillusion-basic-principal-gem-5',
      projectName: 'principal',
      scenarioName: 'g_principal_5',
    },
    b_principal_1: {
      id: 'lesson-codeillusion-basic-principal-book-1',
      projectName: 'principal',
      scenarioName: 'b_principal_1',
    },
  },
  mickey: {
    g_mickey_1: {
      id: 'lesson-codeillusion-basic-mickey-gem-1',
      projectName: 'mickey',
      scenarioName: 'g_mickey_1',
    },
    g_mickey_2: {
      id: 'lesson-codeillusion-basic-mickey-gem-2',
      projectName: 'mickey',
      scenarioName: 'g_mickey_2',
    },
    g_mickey_3: {
      id: 'lesson-codeillusion-basic-mickey-gem-3',
      projectName: 'mickey',
      scenarioName: 'g_mickey_3',
    },
    b_mickey_1: {
      id: 'lesson-codeillusion-basic-mickey-book-1',
      projectName: 'mickey',
      scenarioName: 'b_mickey_1',
    },
  },
  magic_quest_sandbox_media_art: {
    CircleMagic_Adventure: {
      id: 'lesson-codeillusion-basic-magic_quest-circle_magic-adventurous',
      projectName: 'magic_quest_sandbox_media_art',
      scenarioName: 'CircleMagic_Adventure',
    },
    CircleMagic_Hero: {
      id: 'lesson-codeillusion-basic-magic_quest-circle_magic-heroic',
      projectName: 'magic_quest_sandbox_media_art',
      scenarioName: 'CircleMagic_Hero',
    },
    ColorMagicA_Adventure: {
      id: 'lesson-codeillusion-basic-magic_quest-color_magic_a-adventurous',
      projectName: 'magic_quest_sandbox_media_art',
      scenarioName: 'ColorMagicA_Adventure',
    },
    ColorMagicA_Hero: {
      id: 'lesson-codeillusion-basic-magic_quest-color_magic_a-heroic',
      projectName: 'magic_quest_sandbox_media_art',
      scenarioName: 'ColorMagicA_Hero',
    },
    ColorMagicB_Adventure: {
      id: 'lesson-codeillusion-basic-magic_quest-color_magic_b-adventurous',
      projectName: 'magic_quest_sandbox_media_art',
      scenarioName: 'ColorMagicB_Adventure',
    },
    ColorMagicB_Hero: {
      id: 'lesson-codeillusion-basic-magic_quest-color_magic_b-heroic',
      projectName: 'magic_quest_sandbox_media_art',
      scenarioName: 'ColorMagicB_Hero',
    },
    RandomizationMagic_Adventure: {
      id: 'lesson-codeillusion-basic-magic_quest-randomization_magic-adventurous',
      projectName: 'magic_quest_sandbox_media_art',
      scenarioName: 'RandomizationMagic_Adventure',
    },
    RandomizationMagic_Hero: {
      id: 'lesson-codeillusion-basic-magic_quest-randomization_magic-heroic',
      projectName: 'magic_quest_sandbox_media_art',
      scenarioName: 'RandomizationMagic_Hero',
    },
    SchoolOfFish_Adventure: {
      id: 'lesson-codeillusion-basic-magic_quest-school_of_fish-adventurous',
      projectName: 'magic_quest_sandbox_media_art',
      scenarioName: 'SchoolOfFish_Adventure',
    },
    SchoolOfFish_Hero: {
      id: 'lesson-codeillusion-basic-magic_quest-school_of_fish-heroic',
      projectName: 'magic_quest_sandbox_media_art',
      scenarioName: 'SchoolOfFish_Hero',
    },
    'MagicJourney_MediaArt_Ch1-4': {
      id: 'lesson-codeillusion-basic-magic_journey-ma_1_4-heroic',
      projectName: 'magic_quest_sandbox_media_art',
      scenarioName: 'MagicJourney_MediaArt_Ch1-4',
    },
    RandomizationMagic2_Adventure: {
      id: 'lesson-codeillusion-basic-magic_quest-randomization_magic_2-adventurous',
      projectName: 'magic_quest_sandbox_media_art',
      scenarioName: 'RandomizationMagic2_Adventure',
    },
    RandomizationMagic2_Hero: {
      id: 'lesson-codeillusion-basic-magic_quest-randomization_magic_2-heroic',
      projectName: 'magic_quest_sandbox_media_art',
      scenarioName: 'RandomizationMagic2_Hero',
    },
    'MagicJourney_MediaArt_Ch1-7': {
      id: 'lesson-codeillusion-basic-magic_journey-ma_1_7-heroic',
      projectName: 'magic_quest_sandbox_media_art',
      scenarioName: 'MagicJourney_MediaArt_Ch1-7',
    },
  },
  donald: {
    g_donald_1: {
      id: 'lesson-codeillusion-basic-donald-gem-1',
      projectName: 'donald',
      scenarioName: 'g_donald_1',
    },
    g_donald_2: {
      id: 'lesson-codeillusion-basic-donald-gem-2',
      projectName: 'donald',
      scenarioName: 'g_donald_2',
    },
    g_donald_3: {
      id: 'lesson-codeillusion-basic-donald-gem-3',
      projectName: 'donald',
      scenarioName: 'g_donald_3',
    },
    g_donald_4: {
      id: 'lesson-codeillusion-basic-donald-gem-4',
      projectName: 'donald',
      scenarioName: 'g_donald_4',
    },
    b_donald_1: {
      id: 'lesson-codeillusion-basic-donald-book-1',
      projectName: 'donald',
      scenarioName: 'b_donald_1',
    },
  },
  magic_quest_sandbox_web_design_css: {
    ImageMagic_Adventure: {
      id: 'lesson-codeillusion-basic-magic_quest-image_magic-adventurous',
      projectName: 'magic_quest_sandbox_web_design_css',
      scenarioName: 'ImageMagic_Adventure',
    },
    ImageMagic_Hero: {
      id: 'lesson-codeillusion-basic-magic_quest-image_magic-heroic',
      projectName: 'magic_quest_sandbox_web_design_css',
      scenarioName: 'ImageMagic_Hero',
    },
    HatShopWebsite_Adventure: {
      id: 'lesson-codeillusion-basic-magic_quest-hat_shop_site-adventurous',
      projectName: 'magic_quest_sandbox_web_design_css',
      scenarioName: 'HatShopWebsite_Adventure',
    },
    HatShopWebsite_Hero: {
      id: 'lesson-codeillusion-basic-magic_quest-hat_shop_site-heroic',
      projectName: 'magic_quest_sandbox_web_design_css',
      scenarioName: 'HatShopWebsite_Hero',
    },
    StylingMagic3_Adventure: {
      id: 'lesson-codeillusion-basic-magic_quest-styling_magic_3-adventurous',
      projectName: 'magic_quest_sandbox_web_design_css',
      scenarioName: 'StylingMagic3_Adventure',
    },
    StylingMagic3_Hero: {
      id: 'lesson-codeillusion-basic-magic_quest-styling_magic_3-heroic',
      projectName: 'magic_quest_sandbox_web_design_css',
      scenarioName: 'StylingMagic3_Hero',
    },
    PersonFinderSite_Adventure: {
      id: 'lesson-codeillusion-basic-magic_quest-person_finder_site-adventurous',
      projectName: 'magic_quest_sandbox_web_design_css',
      scenarioName: 'PersonFinderSite_Adventure',
    },
    PersonFinderSite_Hero: {
      id: 'lesson-codeillusion-basic-magic_quest-person_finder_site-heroic',
      projectName: 'magic_quest_sandbox_web_design_css',
      scenarioName: 'PersonFinderSite_Hero',
    },
  },
  goofy: {
    g_goofy_1: {
      id: 'lesson-codeillusion-basic-goofy-gem-1',
      projectName: 'goofy',
      scenarioName: 'g_goofy_1',
    },
    g_goofy_2: {
      id: 'lesson-codeillusion-basic-goofy-gem-2',
      projectName: 'goofy',
      scenarioName: 'g_goofy_2',
    },
    g_goofy_3: {
      id: 'lesson-codeillusion-basic-goofy-gem-3',
      projectName: 'goofy',
      scenarioName: 'g_goofy_3',
    },
    g_goofy_4: {
      id: 'lesson-codeillusion-basic-goofy-gem-4',
      projectName: 'goofy',
      scenarioName: 'g_goofy_4',
    },
    b_goofy_1: {
      id: 'lesson-codeillusion-basic-goofy-book-1',
      projectName: 'goofy',
      scenarioName: 'b_goofy_1',
    },
  },
  magic_quest_sandbox_game: {
    SoundMachine_Adventure: {
      id: 'lesson-codeillusion-basic-magic_quest-sound_machine-adventurous',
      projectName: 'magic_quest_sandbox_game',
      scenarioName: 'SoundMachine_Adventure',
    },
    SoundMachine_Hero: {
      id: 'lesson-codeillusion-basic-magic_quest-sound_machine-heroic',
      projectName: 'magic_quest_sandbox_game',
      scenarioName: 'SoundMachine_Hero',
    },
    SpriteMagicA_Adventure: {
      id: 'lesson-codeillusion-basic-magic_quest-sprite_magic_a-adventurous',
      projectName: 'magic_quest_sandbox_game',
      scenarioName: 'SpriteMagicA_Adventure',
    },
    SpriteMagicA_Hero: {
      id: 'lesson-codeillusion-basic-magic_quest-sprite_magic_a-heroic',
      projectName: 'magic_quest_sandbox_game',
      scenarioName: 'SpriteMagicA_Hero',
    },
    SpriteMagicB_Adventure: {
      id: 'lesson-codeillusion-basic-magic_quest-sprite_magic_b-adventurous',
      projectName: 'magic_quest_sandbox_game',
      scenarioName: 'SpriteMagicB_Adventure',
    },
    SpriteMagicB_Hero: {
      id: 'lesson-codeillusion-basic-magic_quest-sprite_magic_b-heroic',
      projectName: 'magic_quest_sandbox_game',
      scenarioName: 'SpriteMagicB_Hero',
    },
    SpriteMagic2_Adventure: {
      id: 'lesson-codeillusion-basic-magic_quest-sprite_magic_2-adventurous',
      projectName: 'magic_quest_sandbox_game',
      scenarioName: 'SpriteMagic2_Adventure',
    },
    SpriteMagic2_Hero: {
      id: 'lesson-codeillusion-basic-magic_quest-sprite_magic_2-heroic',
      projectName: 'magic_quest_sandbox_game',
      scenarioName: 'SpriteMagic2_Hero',
    },
    FlyingCarpet_Adventure: {
      id: 'lesson-codeillusion-basic-magic_quest-flying_carpet-adventurous',
      projectName: 'magic_quest_sandbox_game',
      scenarioName: 'FlyingCarpet_Adventure',
    },
    FlyingCarpet_Hero: {
      id: 'lesson-codeillusion-basic-magic_quest-flying_carpet-heroic',
      projectName: 'magic_quest_sandbox_game',
      scenarioName: 'FlyingCarpet_Hero',
    },
    DungeonEscape_Adventure: {
      id: 'lesson-codeillusion-basic-magic_quest-dungeon_escape-adventurous',
      projectName: 'magic_quest_sandbox_game',
      scenarioName: 'DungeonEscape_Adventure',
    },
    DungeonEscape_Hero: {
      id: 'lesson-codeillusion-basic-magic_quest-dungeon_escape-heroic',
      projectName: 'magic_quest_sandbox_game',
      scenarioName: 'DungeonEscape_Hero',
    },
    MosaicMagic_Adventure: {
      id: 'lesson-codeillusion-basic-magic_quest-mosaic_magic-adventurous',
      projectName: 'magic_quest_sandbox_game',
      scenarioName: 'MosaicMagic_Adventure',
    },
    MosaicMagic_Hero: {
      id: 'lesson-codeillusion-basic-magic_quest-mosaic_magic-heroic',
      projectName: 'magic_quest_sandbox_game',
      scenarioName: 'MosaicMagic_Hero',
    },
    QueensCard_Adventure: {
      id: 'lesson-codeillusion-basic-magic_quest-queens_card-adventurous',
      projectName: 'magic_quest_sandbox_game',
      scenarioName: 'QueensCard_Adventure',
    },
    QueensCard_Hero: {
      id: 'lesson-codeillusion-basic-magic_quest-queens_card-heroic',
      projectName: 'magic_quest_sandbox_game',
      scenarioName: 'QueensCard_Hero',
    },
    'MagicJourney_GameDevelopment_Ch1-4': {
      id: 'lesson-codeillusion-basic-magic_journey-gd_1_4-heroic',
      projectName: 'magic_quest_sandbox_game',
      scenarioName: 'MagicJourney_GameDevelopment_Ch1-4',
    },
    CameraMagic_Adventure: {
      id: 'lesson-codeillusion-basic-magic_quest-camera_magic-adventurous',
      projectName: 'magic_quest_sandbox_game',
      scenarioName: 'CameraMagic_Adventure',
    },
    CameraMagic_Hero: {
      id: 'lesson-codeillusion-basic-magic_quest-camera_magic-heroic',
      projectName: 'magic_quest_sandbox_game',
      scenarioName: 'CameraMagic_Hero',
    },
    ClickMagic2_Adventure: {
      id: 'lesson-codeillusion-basic-magic_quest-click_magic_2-adventurous',
      projectName: 'magic_quest_sandbox_game',
      scenarioName: 'ClickMagic2_Adventure',
    },
    ClickMagic2_Hero: {
      id: 'lesson-codeillusion-basic-magic_quest-click_magic_2-heroic',
      projectName: 'magic_quest_sandbox_game',
      scenarioName: 'ClickMagic2_Hero',
    },
    JewelPuzzle_Adventure: {
      id: 'lesson-codeillusion-basic-magic_quest-jewel_puzzle-adventurous',
      projectName: 'magic_quest_sandbox_game',
      scenarioName: 'JewelPuzzle_Adventure',
    },
    JewelPuzzle_Hero: {
      id: 'lesson-codeillusion-basic-magic_quest-jewel_puzzle-heroic',
      projectName: 'magic_quest_sandbox_game',
      scenarioName: 'JewelPuzzle_Hero',
    },
    SugarRush_Adventure: {
      id: 'lesson-codeillusion-basic-magic_quest-sugar_rush-adventurous',
      projectName: 'magic_quest_sandbox_game',
      scenarioName: 'SugarRush_Adventure',
    },
    SugarRush_Hero: {
      id: 'lesson-codeillusion-basic-magic_quest-sugar_rush-heroic',
      projectName: 'magic_quest_sandbox_game',
      scenarioName: 'SugarRush_Hero',
    },
    DragonAndSword_Adventure: {
      id: 'lesson-codeillusion-basic-magic_quest-dragon_and_sword-adventurous',
      projectName: 'magic_quest_sandbox_game',
      scenarioName: 'DragonAndSword_Adventure',
    },
    DragonAndSword_Hero: {
      id: 'lesson-codeillusion-basic-magic_quest-dragon_and_sword-heroic',
      projectName: 'magic_quest_sandbox_game',
      scenarioName: 'DragonAndSword_Hero',
    },
    'MagicJourney_GameDevelopment_Ch1-7': {
      id: 'lesson-codeillusion-basic-magic_journey-gd_1_7-heroic',
      projectName: 'magic_quest_sandbox_game',
      scenarioName: 'MagicJourney_GameDevelopment_Ch1-7',
    },
  },
  aladdin: {
    g_aladdin_1: {
      id: 'lesson-codeillusion-basic-aladdin-gem-1',
      projectName: 'aladdin',
      scenarioName: 'g_aladdin_1',
    },
    g_aladdin_3: {
      id: 'lesson-codeillusion-basic-aladdin-gem-3',
      projectName: 'aladdin',
      scenarioName: 'g_aladdin_3',
    },
    g_aladdin_4: {
      id: 'lesson-codeillusion-basic-aladdin-gem-4',
      projectName: 'aladdin',
      scenarioName: 'g_aladdin_4',
    },
    g_aladdin_5: {
      id: 'lesson-codeillusion-basic-aladdin-gem-5',
      projectName: 'aladdin',
      scenarioName: 'g_aladdin_5',
    },
    b_aladdin_1: {
      id: 'lesson-codeillusion-basic-aladdin-book-1',
      projectName: 'aladdin',
      scenarioName: 'b_aladdin_1',
    },
    g_aladdin_2: {
      id: 'lesson-codeillusion-basic-aladdin-gem-2',
      projectName: 'aladdin',
      scenarioName: 'g_aladdin_2',
    },
    b_aladdin_2: {
      id: 'lesson-codeillusion-advanced-aladdin-book-2',
      projectName: 'aladdin',
      scenarioName: 'b_aladdin_2',
    },
    b_aladdin_3: {
      id: 'lesson-codeillusion-advanced-aladdin-book-3',
      projectName: 'aladdin',
      scenarioName: 'b_aladdin_3',
    },
    b_aladdin_4: {
      id: 'lesson-codeillusion-advanced-aladdin-book-4',
      projectName: 'aladdin',
      scenarioName: 'b_aladdin_4',
    },
    b_aladdin_5: {
      id: 'lesson-codeillusion-advanced-aladdin-book-5',
      projectName: 'aladdin',
      scenarioName: 'b_aladdin_5',
    },
    b_aladdin_6: {
      id: 'lesson-codeillusion-advanced-aladdin-book-6',
      projectName: 'aladdin',
      scenarioName: 'b_aladdin_6',
    },
    b_aladdin_7: {
      id: 'lesson-codeillusion-advanced-aladdin-book-7',
      projectName: 'aladdin',
      scenarioName: 'b_aladdin_7',
    },
    b_aladdin_8: {
      id: 'lesson-codeillusion-advanced-aladdin-book-8',
      projectName: 'aladdin',
      scenarioName: 'b_aladdin_8',
    },
    b_aladdin_9: {
      id: 'lesson-codeillusion-advanced-aladdin-book-9',
      projectName: 'aladdin',
      scenarioName: 'b_aladdin_9',
    },
  },
  tangled: {
    g_tangled_1: {
      id: 'lesson-codeillusion-basic-tangled-gem-1',
      projectName: 'tangled',
      scenarioName: 'g_tangled_1',
    },
    g_tangled_2: {
      id: 'lesson-codeillusion-basic-tangled-gem-2',
      projectName: 'tangled',
      scenarioName: 'g_tangled_2',
    },
    g_tangled_3: {
      id: 'lesson-codeillusion-basic-tangled-gem-3',
      projectName: 'tangled',
      scenarioName: 'g_tangled_3',
    },
    g_tangled_4: {
      id: 'lesson-codeillusion-basic-tangled-gem-4',
      projectName: 'tangled',
      scenarioName: 'g_tangled_4',
    },
    b_tangled_1: {
      id: 'lesson-codeillusion-basic-tangled-book-1',
      projectName: 'tangled',
      scenarioName: 'b_tangled_1',
    },
    b_tangled_2: {
      id: 'lesson-codeillusion-advanced-tangled-book-2',
      projectName: 'tangled',
      scenarioName: 'b_tangled_2',
    },
    b_tangled_3: {
      id: 'lesson-codeillusion-advanced-tangled-book-3',
      projectName: 'tangled',
      scenarioName: 'b_tangled_3',
    },
  },
  zootopia: {
    g_zootopia_1: {
      id: 'lesson-codeillusion-basic-zootopia-gem-1',
      projectName: 'zootopia',
      scenarioName: 'g_zootopia_1',
    },
    g_zootopia_2: {
      id: 'lesson-codeillusion-basic-zootopia-gem-2',
      projectName: 'zootopia',
      scenarioName: 'g_zootopia_2',
    },
    g_zootopia_3: {
      id: 'lesson-codeillusion-basic-zootopia-gem-3',
      projectName: 'zootopia',
      scenarioName: 'g_zootopia_3',
    },
    g_zootopia_4: {
      id: 'lesson-codeillusion-basic-zootopia-gem-4',
      projectName: 'zootopia',
      scenarioName: 'g_zootopia_4',
    },
    g_zootopia_5: {
      id: 'lesson-codeillusion-basic-zootopia-gem-5',
      projectName: 'zootopia',
      scenarioName: 'g_zootopia_5',
    },
    g_zootopia_6: {
      id: 'lesson-codeillusion-basic-zootopia-gem-6',
      projectName: 'zootopia',
      scenarioName: 'g_zootopia_6',
    },
    b_zootopia_1: {
      id: 'lesson-codeillusion-basic-zootopia-book-1',
      projectName: 'zootopia',
      scenarioName: 'b_zootopia_1',
    },
    b_zootopia_2: {
      id: 'lesson-codeillusion-basic-zootopia-book-2',
      projectName: 'zootopia',
      scenarioName: 'b_zootopia_2',
    },
    b_zootopia_3: {
      id: 'lesson-codeillusion-basic-zootopia-book-3',
      projectName: 'zootopia',
      scenarioName: 'b_zootopia_3',
    },
    b_zootopia_4: {
      id: 'lesson-codeillusion-advanced-zootopia-book-4',
      projectName: 'zootopia',
      scenarioName: 'b_zootopia_4',
    },
    b_zootopia_5: {
      id: 'lesson-codeillusion-advanced-zootopia-book-5',
      projectName: 'zootopia',
      scenarioName: 'b_zootopia_5',
    },
    b_zootopia_6: {
      id: 'lesson-codeillusion-advanced-zootopia-book-6',
      projectName: 'zootopia',
      scenarioName: 'b_zootopia_6',
    },
    b_zootopia_7: {
      id: 'lesson-codeillusion-advanced-zootopia-book-7',
      projectName: 'zootopia',
      scenarioName: 'b_zootopia_7',
    },
    b_zootopia_8: {
      id: 'lesson-codeillusion-advanced-zootopia-book-8',
      projectName: 'zootopia',
      scenarioName: 'b_zootopia_8',
    },
    b_zootopia_9: {
      id: 'lesson-codeillusion-advanced-zootopia-book-9',
      projectName: 'zootopia',
      scenarioName: 'b_zootopia_9',
    },
    b_zootopia_10: {
      id: 'lesson-codeillusion-advanced-zootopia-book-10',
      projectName: 'zootopia',
      scenarioName: 'b_zootopia_10',
    },
  },
  sugar1: {
    g_sugar1_1: {
      id: 'lesson-codeillusion-basic-sugar1-gem-1',
      projectName: 'sugar1',
      scenarioName: 'g_sugar1_1',
    },
    g_sugar1_2: {
      id: 'lesson-codeillusion-basic-sugar1-gem-2',
      projectName: 'sugar1',
      scenarioName: 'g_sugar1_2',
    },
    g_sugar1_3: {
      id: 'lesson-codeillusion-basic-sugar1-gem-3',
      projectName: 'sugar1',
      scenarioName: 'g_sugar1_3',
    },
    g_sugar1_4: {
      id: 'lesson-codeillusion-basic-sugar1-gem-4',
      projectName: 'sugar1',
      scenarioName: 'g_sugar1_4',
    },
    b_sugar1_1: {
      id: 'lesson-codeillusion-basic-sugar1-book-1',
      projectName: 'sugar1',
      scenarioName: 'b_sugar1_1',
    },
    b_sugar1_2: {
      id: 'lesson-codeillusion-basic-sugar1-book-2',
      projectName: 'sugar1',
      scenarioName: 'b_sugar1_2',
    },
    b_sugar1_3: {
      id: 'lesson-codeillusion-advanced-sugar1-book-3',
      projectName: 'sugar1',
      scenarioName: 'b_sugar1_3',
    },
    b_sugar1_4: {
      id: 'lesson-codeillusion-advanced-sugar1-book-4',
      projectName: 'sugar1',
      scenarioName: 'b_sugar1_4',
    },
    b_sugar1_5: {
      id: 'lesson-codeillusion-advanced-sugar1-book-5',
      projectName: 'sugar1',
      scenarioName: 'b_sugar1_5',
    },
    b_sugar1_6: {
      id: 'lesson-codeillusion-advanced-sugar1-book-6',
      projectName: 'sugar1',
      scenarioName: 'b_sugar1_6',
    },
    b_sugar1_7: {
      id: 'lesson-codeillusion-advanced-sugar1-book-7',
      projectName: 'sugar1',
      scenarioName: 'b_sugar1_7',
    },
    b_sugar1_8: {
      id: 'lesson-codeillusion-advanced-sugar1-book-8',
      projectName: 'sugar1',
      scenarioName: 'b_sugar1_8',
    },
    b_sugar1_9: {
      id: 'lesson-codeillusion-advanced-sugar1-book-9',
      projectName: 'sugar1',
      scenarioName: 'b_sugar1_9',
    },
    b_sugar1_10: {
      id: 'lesson-codeillusion-advanced-sugar1-book-10',
      projectName: 'sugar1',
      scenarioName: 'b_sugar1_10',
    },
    b_sugar1_11: {
      id: 'lesson-codeillusion-advanced-sugar1-book-11',
      projectName: 'sugar1',
      scenarioName: 'b_sugar1_11',
    },
  },
  beauty: {
    g_beauty_1: {
      id: 'lesson-codeillusion-basic-beauty-gem-1',
      projectName: 'beauty',
      scenarioName: 'g_beauty_1',
    },
    g_beauty_2: {
      id: 'lesson-codeillusion-basic-beauty-gem-2',
      projectName: 'beauty',
      scenarioName: 'g_beauty_2',
    },
    g_beauty_3: {
      id: 'lesson-codeillusion-basic-beauty-gem-3',
      projectName: 'beauty',
      scenarioName: 'g_beauty_3',
    },
    g_beauty_4: {
      id: 'lesson-codeillusion-basic-beauty-gem-4',
      projectName: 'beauty',
      scenarioName: 'g_beauty_4',
    },
    b_beauty_1: {
      id: 'lesson-codeillusion-basic-beauty-book-1',
      projectName: 'beauty',
      scenarioName: 'b_beauty_1',
    },
    b_beauty_2: {
      id: 'lesson-codeillusion-basic-beauty-book-2',
      projectName: 'beauty',
      scenarioName: 'b_beauty_2',
    },
    b_beauty_3: {
      id: 'lesson-codeillusion-basic-beauty-book-3',
      projectName: 'beauty',
      scenarioName: 'b_beauty_3',
    },
    b_beauty_4: {
      id: 'lesson-codeillusion-basic-beauty-book-4',
      projectName: 'beauty',
      scenarioName: 'b_beauty_4',
    },
    b_beauty_5: {
      id: 'lesson-codeillusion-basic-beauty-book-5',
      projectName: 'beauty',
      scenarioName: 'b_beauty_5',
    },
    b_beauty_6: {
      id: 'lesson-codeillusion-advanced-beauty-book-6',
      projectName: 'beauty',
      scenarioName: 'b_beauty_6',
    },
    b_beauty_7: {
      id: 'lesson-codeillusion-advanced-beauty-book-7',
      projectName: 'beauty',
      scenarioName: 'b_beauty_7',
    },
    b_beauty_8: {
      id: 'lesson-codeillusion-advanced-beauty-book-8',
      projectName: 'beauty',
      scenarioName: 'b_beauty_8',
    },
    b_beauty_9: {
      id: 'lesson-codeillusion-advanced-beauty-book-9',
      projectName: 'beauty',
      scenarioName: 'b_beauty_9',
    },
    b_beauty_10: {
      id: 'lesson-codeillusion-advanced-beauty-book-10',
      projectName: 'beauty',
      scenarioName: 'b_beauty_10',
    },
  },
  mermaid: {
    g_mermaid_1: {
      id: 'lesson-codeillusion-basic-mermaid-gem-1',
      projectName: 'mermaid',
      scenarioName: 'g_mermaid_1',
    },
    g_mermaid_2: {
      id: 'lesson-codeillusion-basic-mermaid-gem-2',
      projectName: 'mermaid',
      scenarioName: 'g_mermaid_2',
    },
    g_mermaid_3: {
      id: 'lesson-codeillusion-basic-mermaid-gem-3',
      projectName: 'mermaid',
      scenarioName: 'g_mermaid_3',
    },
    b_mermaid_1: {
      id: 'lesson-codeillusion-basic-mermaid-book-1',
      projectName: 'mermaid',
      scenarioName: 'b_mermaid_1',
    },
    b_mermaid_2: {
      id: 'lesson-codeillusion-basic-mermaid-book-2',
      projectName: 'mermaid',
      scenarioName: 'b_mermaid_2',
    },
    b_mermaid_3: {
      id: 'lesson-codeillusion-basic-mermaid-book-3',
      projectName: 'mermaid',
      scenarioName: 'b_mermaid_3',
    },
    b_mermaid_4: {
      id: 'lesson-codeillusion-advanced-mermaid-book-4',
      projectName: 'mermaid',
      scenarioName: 'b_mermaid_4',
    },
  },
  stitch: {
    g_stitch_1: {
      id: 'lesson-codeillusion-basic-stitch-gem-1',
      projectName: 'stitch',
      scenarioName: 'g_stitch_1',
    },
    g_stitch_2: {
      id: 'lesson-codeillusion-basic-stitch-gem-2',
      projectName: 'stitch',
      scenarioName: 'g_stitch_2',
    },
    g_stitch_3: {
      id: 'lesson-codeillusion-basic-stitch-gem-3',
      projectName: 'stitch',
      scenarioName: 'g_stitch_3',
    },
    g_stitch_4: {
      id: 'lesson-codeillusion-basic-stitch-gem-4',
      projectName: 'stitch',
      scenarioName: 'g_stitch_4',
    },
    b_stitch_1: {
      id: 'lesson-codeillusion-basic-stitch-book-1',
      projectName: 'stitch',
      scenarioName: 'b_stitch_1',
    },
    b_stitch_2: {
      id: 'lesson-codeillusion-basic-stitch-book-2',
      projectName: 'stitch',
      scenarioName: 'b_stitch_2',
    },
    b_stitch_3: {
      id: 'lesson-codeillusion-basic-stitch-book-3',
      projectName: 'stitch',
      scenarioName: 'b_stitch_3',
    },
    b_stitch_4: {
      id: 'lesson-codeillusion-basic-stitch-book-4',
      projectName: 'stitch',
      scenarioName: 'b_stitch_4',
    },
    b_stitch_5: {
      id: 'lesson-codeillusion-advanced-stitch-book-5',
      projectName: 'stitch',
      scenarioName: 'b_stitch_5',
    },
    b_stitch_6: {
      id: 'lesson-codeillusion-advanced-stitch-book-6',
      projectName: 'stitch',
      scenarioName: 'b_stitch_6',
    },
    b_stitch_7: {
      id: 'lesson-codeillusion-advanced-stitch-book-7',
      projectName: 'stitch',
      scenarioName: 'b_stitch_7',
    },
    b_stitch_8: {
      id: 'lesson-codeillusion-advanced-stitch-book-8',
      projectName: 'stitch',
      scenarioName: 'b_stitch_8',
    },
    b_stitch_9: {
      id: 'lesson-codeillusion-advanced-stitch-book-9',
      projectName: 'stitch',
      scenarioName: 'b_stitch_9',
    },
    b_stitch_10: {
      id: 'lesson-codeillusion-advanced-stitch-book-10',
      projectName: 'stitch',
      scenarioName: 'b_stitch_10',
    },
    b_stitch_11: {
      id: 'lesson-codeillusion-advanced-stitch-book-11',
      projectName: 'stitch',
      scenarioName: 'b_stitch_11',
    },
  },
  magic_quest_sandbox_web_design_js: {
    PhotoGallery_Adventure: {
      id: 'lesson-codeillusion-basic-magic_quest-photo_gallery-adventurous',
      projectName: 'magic_quest_sandbox_web_design_js',
      scenarioName: 'PhotoGallery_Adventure',
    },
    PhotoGallery_Hero: {
      id: 'lesson-codeillusion-basic-magic_quest-photo_gallery-heroic',
      projectName: 'magic_quest_sandbox_web_design_js',
      scenarioName: 'PhotoGallery_Hero',
    },
    'MagicJourney_WebDesign_Ch1-4': {
      id: 'lesson-codeillusion-basic-magic_journey-wd_1_4-heroic',
      projectName: 'magic_quest_sandbox_web_design_js',
      scenarioName: 'MagicJourney_WebDesign_Ch1-4',
    },
    'MagicJourney_WebDesign_Ch1-7': {
      id: 'lesson-codeillusion-basic-magic_journey-wd_1_7-heroic',
      projectName: 'magic_quest_sandbox_web_design_js',
      scenarioName: 'MagicJourney_WebDesign_Ch1-7',
    },
  },
  alice: {
    g_alice_1: {
      id: 'lesson-codeillusion-basic-alice-gem-1',
      projectName: 'alice',
      scenarioName: 'g_alice_1',
    },
    g_alice_2: {
      id: 'lesson-codeillusion-basic-alice-gem-2',
      projectName: 'alice',
      scenarioName: 'g_alice_2',
    },
    g_alice_3: {
      id: 'lesson-codeillusion-basic-alice-gem-3',
      projectName: 'alice',
      scenarioName: 'g_alice_3',
    },
    b_alice_1: {
      id: 'lesson-codeillusion-basic-alice-book-1',
      projectName: 'alice',
      scenarioName: 'b_alice_1',
    },
    b_alice_2: {
      id: 'lesson-codeillusion-basic-alice-book-2',
      projectName: 'alice',
      scenarioName: 'b_alice_2',
    },
    b_alice_3: {
      id: 'lesson-codeillusion-basic-alice-book-3',
      projectName: 'alice',
      scenarioName: 'b_alice_3',
    },
    b_alice_4: {
      id: 'lesson-codeillusion-basic-alice-book-4',
      projectName: 'alice',
      scenarioName: 'b_alice_4',
    },
    b_alice_5: {
      id: 'lesson-codeillusion-basic-alice-book-5',
      projectName: 'alice',
      scenarioName: 'b_alice_5',
    },
    b_alice_6: {
      id: 'lesson-codeillusion-advanced-alice-book-6',
      projectName: 'alice',
      scenarioName: 'b_alice_6',
    },
    b_alice_7: {
      id: 'lesson-codeillusion-advanced-alice-book-7',
      projectName: 'alice',
      scenarioName: 'b_alice_7',
    },
    b_alice_8: {
      id: 'lesson-codeillusion-advanced-alice-book-8',
      projectName: 'alice',
      scenarioName: 'b_alice_8',
    },
    b_alice_9: {
      id: 'lesson-codeillusion-advanced-alice-book-9',
      projectName: 'alice',
      scenarioName: 'b_alice_9',
    },
    b_alice_10: {
      id: 'lesson-codeillusion-advanced-alice-book-10',
      projectName: 'alice',
      scenarioName: 'b_alice_10',
    },
    b_alice_11: {
      id: 'lesson-codeillusion-advanced-alice-book-11',
      projectName: 'alice',
      scenarioName: 'b_alice_11',
    },
  },
  pooh: {
    g_pooh_1: {
      id: 'lesson-codeillusion-basic-pooh-gem-1',
      projectName: 'pooh',
      scenarioName: 'g_pooh_1',
    },
    g_pooh_2: {
      id: 'lesson-codeillusion-basic-pooh-gem-2',
      projectName: 'pooh',
      scenarioName: 'g_pooh_2',
    },
    b_pooh_1: {
      id: 'lesson-codeillusion-basic-pooh-book-1',
      projectName: 'pooh',
      scenarioName: 'b_pooh_1',
    },
    b_pooh_2: {
      id: 'lesson-codeillusion-basic-pooh-book-2',
      projectName: 'pooh',
      scenarioName: 'b_pooh_2',
    },
    b_pooh_3: {
      id: 'lesson-codeillusion-basic-pooh-book-3',
      projectName: 'pooh',
      scenarioName: 'b_pooh_3',
    },
    b_pooh_4: {
      id: 'lesson-codeillusion-basic-pooh-book-4',
      projectName: 'pooh',
      scenarioName: 'b_pooh_4',
    },
    b_pooh_5: {
      id: 'lesson-codeillusion-basic-pooh-book-5',
      projectName: 'pooh',
      scenarioName: 'b_pooh_5',
    },
    b_pooh_6: {
      id: 'lesson-codeillusion-advanced-pooh-book-6',
      projectName: 'pooh',
      scenarioName: 'b_pooh_6',
    },
    b_pooh_7: {
      id: 'lesson-codeillusion-advanced-pooh-book-7',
      projectName: 'pooh',
      scenarioName: 'b_pooh_7',
    },
    b_pooh_8: {
      id: 'lesson-codeillusion-advanced-pooh-book-8',
      projectName: 'pooh',
      scenarioName: 'b_pooh_8',
    },
    b_pooh_9: {
      id: 'lesson-codeillusion-advanced-pooh-book-9',
      projectName: 'pooh',
      scenarioName: 'b_pooh_9',
    },
    b_pooh_10: {
      id: 'lesson-codeillusion-advanced-pooh-book-10',
      projectName: 'pooh',
      scenarioName: 'b_pooh_10',
    },
    b_pooh_11: {
      id: 'lesson-codeillusion-advanced-pooh-book-11',
      projectName: 'pooh',
      scenarioName: 'b_pooh_11',
    },
    b_pooh_12: {
      id: 'lesson-codeillusion-advanced-pooh-book-12',
      projectName: 'pooh',
      scenarioName: 'b_pooh_12',
    },
    b_pooh_13: {
      id: 'lesson-codeillusion-advanced-pooh-book-13',
      projectName: 'pooh',
      scenarioName: 'b_pooh_13',
    },
  },
  bighero6: {
    g_bighero6_1: {
      id: 'lesson-codeillusion-basic-bighero6-gem-1',
      projectName: 'bighero6',
      scenarioName: 'g_bighero6_1',
    },
    g_bighero6_2: {
      id: 'lesson-codeillusion-basic-bighero6-gem-2',
      projectName: 'bighero6',
      scenarioName: 'g_bighero6_2',
    },
    b_bighero6_1: {
      id: 'lesson-codeillusion-basic-bighero6-book-1',
      projectName: 'bighero6',
      scenarioName: 'b_bighero6_1',
    },
    b_bighero6_2: {
      id: 'lesson-codeillusion-basic-bighero6-book-2',
      projectName: 'bighero6',
      scenarioName: 'b_bighero6_2',
    },
    b_bighero6_3: {
      id: 'lesson-codeillusion-basic-bighero6-book-3',
      projectName: 'bighero6',
      scenarioName: 'b_bighero6_3',
    },
    b_bighero6_4: {
      id: 'lesson-codeillusion-basic-bighero6-book-4',
      projectName: 'bighero6',
      scenarioName: 'b_bighero6_4',
    },
    b_bighero6_5: {
      id: 'lesson-codeillusion-basic-bighero6-book-5',
      projectName: 'bighero6',
      scenarioName: 'b_bighero6_5',
    },
    b_bighero6_6: {
      id: 'lesson-codeillusion-advanced-bighero6-book-6',
      projectName: 'bighero6',
      scenarioName: 'b_bighero6_6',
    },
    b_bighero6_7: {
      id: 'lesson-codeillusion-advanced-bighero6-book-7',
      projectName: 'bighero6',
      scenarioName: 'b_bighero6_7',
    },
    b_bighero6_8: {
      id: 'lesson-codeillusion-advanced-bighero6-book-8',
      projectName: 'bighero6',
      scenarioName: 'b_bighero6_8',
    },
    b_bighero6_9: {
      id: 'lesson-codeillusion-advanced-bighero6-book-9',
      projectName: 'bighero6',
      scenarioName: 'b_bighero6_9',
    },
    b_bighero6_10: {
      id: 'lesson-codeillusion-advanced-bighero6-book-10',
      projectName: 'bighero6',
      scenarioName: 'b_bighero6_10',
    },
    b_bighero6_11: {
      id: 'lesson-codeillusion-advanced-bighero6-book-11',
      projectName: 'bighero6',
      scenarioName: 'b_bighero6_11',
    },
  },
  snowwhite: {
    g_snowwhite_1: {
      id: 'lesson-codeillusion-basic-snowwhite-gem-1',
      projectName: 'snowwhite',
      scenarioName: 'g_snowwhite_1',
    },
    g_snowwhite_2: {
      id: 'lesson-codeillusion-basic-snowwhite-gem-2',
      projectName: 'snowwhite',
      scenarioName: 'g_snowwhite_2',
    },
    b_snowwhite_1: {
      id: 'lesson-codeillusion-basic-snowwhite-book-1',
      projectName: 'snowwhite',
      scenarioName: 'b_snowwhite_1',
    },
    b_snowwhite_2: {
      id: 'lesson-codeillusion-basic-snowwhite-book-2',
      projectName: 'snowwhite',
      scenarioName: 'b_snowwhite_2',
    },
    b_snowwhite_3: {
      id: 'lesson-codeillusion-basic-snowwhite-book-3',
      projectName: 'snowwhite',
      scenarioName: 'b_snowwhite_3',
    },
    b_snowwhite_4: {
      id: 'lesson-codeillusion-basic-snowwhite-book-4',
      projectName: 'snowwhite',
      scenarioName: 'b_snowwhite_4',
    },
    b_snowwhite_5: {
      id: 'lesson-codeillusion-basic-snowwhite-book-5',
      projectName: 'snowwhite',
      scenarioName: 'b_snowwhite_5',
    },
    b_snowwhite_6: {
      id: 'lesson-codeillusion-basic-snowwhite-book-6',
      projectName: 'snowwhite',
      scenarioName: 'b_snowwhite_6',
    },
    b_snowwhite_7: {
      id: 'lesson-codeillusion-basic-snowwhite-book-7',
      projectName: 'snowwhite',
      scenarioName: 'b_snowwhite_7',
    },
    b_snowwhite_8: {
      id: 'lesson-codeillusion-basic-snowwhite-book-8',
      projectName: 'snowwhite',
      scenarioName: 'b_snowwhite_8',
    },
    b_snowwhite_9: {
      id: 'lesson-codeillusion-basic-snowwhite-book-9',
      projectName: 'snowwhite',
      scenarioName: 'b_snowwhite_9',
    },
  },
  sugar2: {
    g_sugar2_1: {
      id: 'lesson-codeillusion-basic-sugar2-gem-1',
      projectName: 'sugar2',
      scenarioName: 'g_sugar2_1',
    },
    g_sugar2_2: {
      id: 'lesson-codeillusion-basic-sugar2-gem-2',
      projectName: 'sugar2',
      scenarioName: 'g_sugar2_2',
    },
    b_sugar2_1: {
      id: 'lesson-codeillusion-basic-sugar2-book-1',
      projectName: 'sugar2',
      scenarioName: 'b_sugar2_1',
    },
    b_sugar2_2: {
      id: 'lesson-codeillusion-basic-sugar2-book-2',
      projectName: 'sugar2',
      scenarioName: 'b_sugar2_2',
    },
    b_sugar2_3: {
      id: 'lesson-codeillusion-basic-sugar2-book-3',
      projectName: 'sugar2',
      scenarioName: 'b_sugar2_3',
    },
    b_sugar2_4: {
      id: 'lesson-codeillusion-basic-sugar2-book-4',
      projectName: 'sugar2',
      scenarioName: 'b_sugar2_4',
    },
    b_sugar2_5: {
      id: 'lesson-codeillusion-basic-sugar2-book-5',
      projectName: 'sugar2',
      scenarioName: 'b_sugar2_5',
    },
    b_sugar2_6: {
      id: 'lesson-codeillusion-advanced-sugar2-book-6',
      projectName: 'sugar2',
      scenarioName: 'b_sugar2_6',
    },
    b_sugar2_7: {
      id: 'lesson-codeillusion-advanced-sugar2-book-7',
      projectName: 'sugar2',
      scenarioName: 'b_sugar2_7',
    },
    b_sugar2_8: {
      id: 'lesson-codeillusion-advanced-sugar2-book-8',
      projectName: 'sugar2',
      scenarioName: 'b_sugar2_8',
    },
    b_sugar2_9: {
      id: 'lesson-codeillusion-advanced-sugar2-book-9',
      projectName: 'sugar2',
      scenarioName: 'b_sugar2_9',
    },
    b_sugar2_10: {
      id: 'lesson-codeillusion-advanced-sugar2-book-10',
      projectName: 'sugar2',
      scenarioName: 'b_sugar2_10',
    },
    b_sugar2_11: {
      id: 'lesson-codeillusion-advanced-sugar2-book-11',
      projectName: 'sugar2',
      scenarioName: 'b_sugar2_11',
    },
    b_sugar2_12: {
      id: 'lesson-codeillusion-advanced-sugar2-book-12',
      projectName: 'sugar2',
      scenarioName: 'b_sugar2_12',
    },
  },
  frozen: {
    g_frozen_1: {
      id: 'lesson-codeillusion-basic-frozen-gem-1',
      projectName: 'frozen',
      scenarioName: 'g_frozen_1',
    },
    g_frozen_2: {
      id: 'lesson-codeillusion-basic-frozen-gem-2',
      projectName: 'frozen',
      scenarioName: 'g_frozen_2',
    },
    g_frozen_3: {
      id: 'lesson-codeillusion-basic-frozen-gem-3',
      projectName: 'frozen',
      scenarioName: 'g_frozen_3',
    },
    g_frozen_4: {
      id: 'lesson-codeillusion-basic-frozen-gem-4',
      projectName: 'frozen',
      scenarioName: 'g_frozen_4',
    },
    b_frozen_1: {
      id: 'lesson-codeillusion-basic-frozen-book-1',
      projectName: 'frozen',
      scenarioName: 'b_frozen_1',
    },
    b_frozen_2: {
      id: 'lesson-codeillusion-basic-frozen-book-2',
      projectName: 'frozen',
      scenarioName: 'b_frozen_2',
    },
    b_frozen_3: {
      id: 'lesson-codeillusion-basic-frozen-book-3',
      projectName: 'frozen',
      scenarioName: 'b_frozen_3',
    },
    b_frozen_4: {
      id: 'lesson-codeillusion-advanced-frozen-book-4',
      projectName: 'frozen',
      scenarioName: 'b_frozen_4',
    },
    b_frozen_5: {
      id: 'lesson-codeillusion-advanced-frozen-book-5',
      projectName: 'frozen',
      scenarioName: 'b_frozen_5',
    },
    b_frozen_6: {
      id: 'lesson-codeillusion-advanced-frozen-book-6',
      projectName: 'frozen',
      scenarioName: 'b_frozen_6',
    },
    b_frozen_7: {
      id: 'lesson-codeillusion-advanced-frozen-book-7',
      projectName: 'frozen',
      scenarioName: 'b_frozen_7',
    },
    b_frozen_8: {
      id: 'lesson-codeillusion-advanced-frozen-book-8',
      projectName: 'frozen',
      scenarioName: 'b_frozen_8',
    },
  },
  sleepingbeauty: {
    g_sleepingbeauty_1: {
      id: 'lesson-codeillusion-basic-sleepingbeauty-gem-1',
      projectName: 'sleepingbeauty',
      scenarioName: 'g_sleepingbeauty_1',
    },
    g_sleepingbeauty_2: {
      id: 'lesson-codeillusion-basic-sleepingbeauty-gem-2',
      projectName: 'sleepingbeauty',
      scenarioName: 'g_sleepingbeauty_2',
    },
    b_sleepingbeauty_1: {
      id: 'lesson-codeillusion-basic-sleepingbeauty-book-1',
      projectName: 'sleepingbeauty',
      scenarioName: 'b_sleepingbeauty_1',
    },
    b_sleepingbeauty_2: {
      id: 'lesson-codeillusion-basic-sleepingbeauty-book-2',
      projectName: 'sleepingbeauty',
      scenarioName: 'b_sleepingbeauty_2',
    },
    b_sleepingbeauty_3: {
      id: 'lesson-codeillusion-basic-sleepingbeauty-book-3',
      projectName: 'sleepingbeauty',
      scenarioName: 'b_sleepingbeauty_3',
    },
    b_sleepingbeauty_4: {
      id: 'lesson-codeillusion-advanced-sleepingbeauty-book-4',
      projectName: 'sleepingbeauty',
      scenarioName: 'b_sleepingbeauty_4',
    },
    b_sleepingbeauty_5: {
      id: 'lesson-codeillusion-advanced-sleepingbeauty-book-5',
      projectName: 'sleepingbeauty',
      scenarioName: 'b_sleepingbeauty_5',
    },
    b_sleepingbeauty_6: {
      id: 'lesson-codeillusion-advanced-sleepingbeauty-book-6',
      projectName: 'sleepingbeauty',
      scenarioName: 'b_sleepingbeauty_6',
    },
    b_sleepingbeauty_7: {
      id: 'lesson-codeillusion-advanced-sleepingbeauty-book-7',
      projectName: 'sleepingbeauty',
      scenarioName: 'b_sleepingbeauty_7',
    },
    b_sleepingbeauty_8: {
      id: 'lesson-codeillusion-advanced-sleepingbeauty-book-8',
      projectName: 'sleepingbeauty',
      scenarioName: 'b_sleepingbeauty_8',
    },
    b_sleepingbeauty_9: {
      id: 'lesson-codeillusion-advanced-sleepingbeauty-book-9',
      projectName: 'sleepingbeauty',
      scenarioName: 'b_sleepingbeauty_9',
    },
  },
  shop_ma: {
    ma_shop_1: {
      id: 'lesson-codeillusion-advanced-shop_ma-gem-1',
      projectName: 'shop_ma',
      scenarioName: 'ma_shop_1',
    },
    ma_shop_2: {
      id: 'lesson-codeillusion-advanced-shop_ma-gem-2',
      projectName: 'shop_ma',
      scenarioName: 'ma_shop_2',
    },
    ma_shop_3: {
      id: 'lesson-codeillusion-advanced-shop_ma-gem-3',
      projectName: 'shop_ma',
      scenarioName: 'ma_shop_3',
    },
    ma_shop_4: {
      id: 'lesson-codeillusion-advanced-shop_ma-gem-4',
      projectName: 'shop_ma',
      scenarioName: 'ma_shop_4',
    },
    ma_shop_5: {
      id: 'lesson-codeillusion-advanced-shop_ma-gem-5',
      projectName: 'shop_ma',
      scenarioName: 'ma_shop_5',
    },
    ma_shop_6: {
      id: 'lesson-codeillusion-advanced-shop_ma-gem-6',
      projectName: 'shop_ma',
      scenarioName: 'ma_shop_6',
    },
    ma_shop_7: {
      id: 'lesson-codeillusion-advanced-shop_ma-gem-7',
      projectName: 'shop_ma',
      scenarioName: 'ma_shop_7',
    },
    ma_shop_8: {
      id: 'lesson-codeillusion-advanced-shop_ma-gem-8',
      projectName: 'shop_ma',
      scenarioName: 'ma_shop_8',
    },
    ma_shop_9: {
      id: 'lesson-codeillusion-advanced-shop_ma-gem-9',
      projectName: 'shop_ma',
      scenarioName: 'ma_shop_9',
    },
    ma_shop_10: {
      id: 'lesson-codeillusion-advanced-shop_ma-gem-10',
      projectName: 'shop_ma',
      scenarioName: 'ma_shop_10',
    },
    ma_shop_11: {
      id: 'lesson-codeillusion-advanced-shop_ma-gem-11',
      projectName: 'shop_ma',
      scenarioName: 'ma_shop_11',
    },
    ma_shop_12: {
      id: 'lesson-codeillusion-advanced-shop_ma-gem-12',
      projectName: 'shop_ma',
      scenarioName: 'ma_shop_12',
    },
    ma_shop_13: {
      id: 'lesson-codeillusion-advanced-shop_ma-gem-13',
      projectName: 'shop_ma',
      scenarioName: 'ma_shop_13',
    },
    ma_shop_14: {
      id: 'lesson-codeillusion-advanced-shop_ma-gem-14',
      projectName: 'shop_ma',
      scenarioName: 'ma_shop_14',
    },
  },
  shop_game: {
    game_shop_1: {
      id: 'lesson-codeillusion-advanced-shop_game-gem-1',
      projectName: 'shop_game',
      scenarioName: 'game_shop_1',
    },
    game_shop_2: {
      id: 'lesson-codeillusion-advanced-shop_game-gem-2',
      projectName: 'shop_game',
      scenarioName: 'game_shop_2',
    },
  },
  shop_wd: {
    wd_shop_1: {
      id: 'lesson-codeillusion-advanced-shop_wd-gem-1',
      projectName: 'shop_wd',
      scenarioName: 'wd_shop_1',
    },
    wd_shop_2: {
      id: 'lesson-codeillusion-advanced-shop_wd-gem-2',
      projectName: 'shop_wd',
      scenarioName: 'wd_shop_2',
    },
    wd_shop_3: {
      id: 'lesson-codeillusion-advanced-shop_wd-gem-3',
      projectName: 'shop_wd',
      scenarioName: 'wd_shop_3',
    },
    wd_shop_4: {
      id: 'lesson-codeillusion-advanced-shop_wd-gem-4',
      projectName: 'shop_wd',
      scenarioName: 'wd_shop_4',
    },
    wd_shop_5: {
      id: 'lesson-codeillusion-advanced-shop_wd-gem-5',
      projectName: 'shop_wd',
      scenarioName: 'wd_shop_5',
    },
    wd_shop_6: {
      id: 'lesson-codeillusion-advanced-shop_wd-gem-6',
      projectName: 'shop_wd',
      scenarioName: 'wd_shop_6',
    },
    wd_shop_7: {
      id: 'lesson-codeillusion-advanced-shop_wd-gem-7',
      projectName: 'shop_wd',
      scenarioName: 'wd_shop_7',
    },
  },
  information1: {
    '00_01': {
      id: 'lesson-cse-is-00_01',
      projectName: 'information1',
      scenarioName: '00_01',
    },
    '00_02': {
      id: 'lesson-cse-is-00_02',
      projectName: 'information1',
      scenarioName: '00_02',
    },
    '00_03': {
      id: 'lesson-cse-is-00_03',
      projectName: 'information1',
      scenarioName: '00_03',
    },
    '00_05': {
      id: 'lesson-cse-is-00_05',
      projectName: 'information1',
      scenarioName: '00_05',
    },
    '00_07': {
      id: 'lesson-cse-is-00_07',
      projectName: 'information1',
      scenarioName: '00_07',
    },
    '00_quiz': {
      id: 'lesson-cse-is-00_quiz',
      projectName: 'information1',
      scenarioName: '00_quiz',
    },
    '01_01': {
      id: 'lesson-cse-cs-01_01',
      projectName: 'information1',
      scenarioName: '01_01',
    },
    '01_02': {
      id: 'lesson-cse-cs-01_02',
      projectName: 'information1',
      scenarioName: '01_02',
    },
    '01_04': {
      id: 'lesson-cse-cs-01_04',
      projectName: 'information1',
      scenarioName: '01_04',
    },
    '01_03': {
      id: 'lesson-cse-cs-01_03',
      projectName: 'information1',
      scenarioName: '01_03',
    },
    '01_05': {
      id: 'lesson-cse-cs-01_05',
      projectName: 'information1',
      scenarioName: '01_05',
    },
    'cs-01_quiz01': {
      id: 'lesson-cse-cs-01_quiz01',
      projectName: 'information1',
      scenarioName: 'cs-01_quiz01',
    },
    '01_06': {
      id: 'lesson-cse-cs-01_06',
      projectName: 'information1',
      scenarioName: '01_06',
    },
    '01_07': {
      id: 'lesson-cse-cs-01_07',
      projectName: 'information1',
      scenarioName: '01_07',
    },
    '01_08': {
      id: 'lesson-cse-cs-01_08',
      projectName: 'information1',
      scenarioName: '01_08',
    },
    '01_09': {
      id: 'lesson-cse-cs-01_09',
      projectName: 'information1',
      scenarioName: '01_09',
    },
    '01_10': {
      id: 'lesson-cse-cs-01_10',
      projectName: 'information1',
      scenarioName: '01_10',
    },
    '01_11': {
      id: 'lesson-cse-cs-01_11',
      projectName: 'information1',
      scenarioName: '01_11',
    },
    '01_12': {
      id: 'lesson-cse-cs-01_12',
      projectName: 'information1',
      scenarioName: '01_12',
    },
    'cs-01_quiz02': {
      id: 'lesson-cse-cs-01_quiz02',
      projectName: 'information1',
      scenarioName: 'cs-01_quiz02',
    },
    '01_13': {
      id: 'lesson-cse-cs-01_13',
      projectName: 'information1',
      scenarioName: '01_13',
    },
    '01_14': {
      id: 'lesson-cse-cs-01_14',
      projectName: 'information1',
      scenarioName: '01_14',
    },
    '01_15': {
      id: 'lesson-cse-cs-01_15',
      projectName: 'information1',
      scenarioName: '01_15',
    },
    '01_16': {
      id: 'lesson-cse-cs-01_16',
      projectName: 'information1',
      scenarioName: '01_16',
    },
    '01_17': {
      id: 'lesson-cse-cs-01_17',
      projectName: 'information1',
      scenarioName: '01_17',
    },
    '01_18': {
      id: 'lesson-cse-cs-01_18',
      projectName: 'information1',
      scenarioName: '01_18',
    },
    '01_19': {
      id: 'lesson-cse-cs-01_19',
      projectName: 'information1',
      scenarioName: '01_19',
    },
    '01_20': {
      id: 'lesson-cse-cs-01_20',
      projectName: 'information1',
      scenarioName: '01_20',
    },
    'cs-01_quiz03': {
      id: 'lesson-cse-cs-01_quiz03',
      projectName: 'information1',
      scenarioName: 'cs-01_quiz03',
    },
    '02_01': {
      id: 'lesson-cse-nw-02_01',
      projectName: 'information1',
      scenarioName: '02_01',
    },
    '02_02': {
      id: 'lesson-cse-nw-02_02',
      projectName: 'information1',
      scenarioName: '02_02',
    },
    '02_03': {
      id: 'lesson-cse-nw-02_03',
      projectName: 'information1',
      scenarioName: '02_03',
    },
    '02_04': {
      id: 'lesson-cse-nw-02_04',
      projectName: 'information1',
      scenarioName: '02_04',
    },
    'nw-02_quiz01': {
      id: 'lesson-cse-nw-02_quiz01',
      projectName: 'information1',
      scenarioName: 'nw-02_quiz01',
    },
    '02_05': {
      id: 'lesson-cse-nw-02_05',
      projectName: 'information1',
      scenarioName: '02_05',
    },
    '02_06': {
      id: 'lesson-cse-nw-02_06',
      projectName: 'information1',
      scenarioName: '02_06',
    },
    '02_07': {
      id: 'lesson-cse-nw-02_07',
      projectName: 'information1',
      scenarioName: '02_07',
    },
    '02_08': {
      id: 'lesson-cse-nw-02_08',
      projectName: 'information1',
      scenarioName: '02_08',
    },
    '02_09': {
      id: 'lesson-cse-nw-02_09',
      projectName: 'information1',
      scenarioName: '02_09',
    },
    '02_10': {
      id: 'lesson-cse-nw-02_10',
      projectName: 'information1',
      scenarioName: '02_10',
    },
    '02_11': {
      id: 'lesson-cse-nw-02_11',
      projectName: 'information1',
      scenarioName: '02_11',
    },
    '02_12': {
      id: 'lesson-cse-nw-02_12',
      projectName: 'information1',
      scenarioName: '02_12',
    },
    'nw-02_quiz02': {
      id: 'lesson-cse-nw-02_quiz02',
      projectName: 'information1',
      scenarioName: 'nw-02_quiz02',
    },
    '02_13': {
      id: 'lesson-cse-nw-02_13',
      projectName: 'information1',
      scenarioName: '02_13',
    },
    '02_14': {
      id: 'lesson-cse-nw-02_14',
      projectName: 'information1',
      scenarioName: '02_14',
    },
    '02_15': {
      id: 'lesson-cse-nw-02_15',
      projectName: 'information1',
      scenarioName: '02_15',
    },
    '02_16': {
      id: 'lesson-cse-nw-02_16',
      projectName: 'information1',
      scenarioName: '02_16',
    },
    '02_17': {
      id: 'lesson-cse-nw-02_17',
      projectName: 'information1',
      scenarioName: '02_17',
    },
    'nw-02_quiz03': {
      id: 'lesson-cse-nw-02_quiz03',
      projectName: 'information1',
      scenarioName: 'nw-02_quiz03',
    },
  },
}
