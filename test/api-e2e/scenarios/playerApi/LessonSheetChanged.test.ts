import axios from 'axios'
import { Paths } from '../../../../src/adapter/entry-points/_gen/codex-usa-backend-types'
import { setupEnvironment, teardownEnvironment } from '../../utilities'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)
describe('LessonSheetChanged', () => {
  test('success', async () => {
    const res = await axios.post<Paths.PostLessonSheetChanged.Responses.$200>(
      'player_api/lesson_sheet_changed?lessonName=g_mickey_1',
      {
        scenario: {
          steps: [
            {
              stepId: 0,
              bgm: {
                src: '/api/shared/mp3/BGM00_gemlesson.mp3',
              },
              defaultNextStepId: 1,
              elementList: [],
              enterBehaviourList: [],
              exitCondition: {},
              exitBehaviourList: [],
              metaData: {
                stepId: 0,
                stepType: {
                  type: 'code',
                  code: 'playBgm',
                },
                preloadUrlList: ['/api/shared/mp3/BGM00_gemlesson.mp3'],
                customUpdateRuleList: [],
                uniqueId:
                  '/Ygl10WcBn9U+P6ftmIgIE4hYNzjXCgix3FJkZeFwjSr1hgNhKqtxBPz9Dm8QR+9TNoMtSHo/z5Jol5t/aOWCw==',
              },
            },
            {
              stepId: 1,
              bgm: {
                src: '/api/shared/mp3/BGM00_gemlesson.mp3',
              },
              defaultNextStepId: 2,
              elementList: [
                {
                  elementName: 'SlideElement',
                  domId: 'slide',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'qNVocsJa9IBwUsOsUIX0WyE6xTd7V1D+ctCpmIzYE/m9OjHkU1AEb4W6MILDUG61uuZKKMMrYhS6YE2CTXqYIw==',
                  },
                  src: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/png/001.png',
                  zIndex: 25,
                  mask: 'transparent-black-mask',
                  sizeAndPosition: {
                    left: '50%',
                    top: '50%',
                    width: '900px',
                    height: '480px',
                    transform: 'translate(-50%, -50%)',
                  },
                  title: null,
                },
                {
                  elementName: 'FlashElement',
                  domId: 'mimil',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'qNVocsJa9IBwUsOsUIX0WyE6xTd7V1D+ctCpmIzYE/m9OjHkU1AEb4W6MILDUG61uuZKKMMrYhS6YE2CTXqYIw==',
                  },
                  flashName: 'mimil',
                  sizeAndPosition: {
                    left: '75%',
                    top: '65%',
                    width: null,
                    height: null,
                  },
                  isImage: false,
                  isDraggable: true,
                },
              ],
              enterBehaviourList: [],
              exitCondition: {
                type: 'AND',
                detailList: ['AnimationFinish:mimil'],
              },
              exitBehaviourList: [],
              metaData: {
                stepId: 1,
                stepType: {
                  type: 'talk',
                  slide: 'createImage',
                  onlyMove: true,
                },
                preloadUrlList: [
                  '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/png/001.png',
                ],
                customUpdateRuleList: [],
                uniqueId:
                  'qNVocsJa9IBwUsOsUIX0WyE6xTd7V1D+ctCpmIzYE/m9OjHkU1AEb4W6MILDUG61uuZKKMMrYhS6YE2CTXqYIw==',
              },
            },
            {
              stepId: 2,
              bgm: {
                src: '/api/shared/mp3/BGM00_gemlesson.mp3',
              },
              defaultNextStepId: 3,
              elementList: [
                {
                  elementName: 'SlideElement',
                  domId: 'slide',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'qNVocsJa9IBwUsOsUIX0WyE6xTd7V1D+ctCpmIzYE/m9OjHkU1AEb4W6MILDUG61uuZKKMMrYhS6YE2CTXqYIw==',
                  },
                  src: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/png/001.png',
                  zIndex: 25,
                  mask: 'transparent-black-mask',
                  sizeAndPosition: {
                    left: '50%',
                    top: '50%',
                    width: '900px',
                    height: '480px',
                    transform: 'translate(-50%, -50%)',
                  },
                  title: null,
                },
                {
                  elementName: 'FlashElement',
                  domId: 'mimil',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'qNVocsJa9IBwUsOsUIX0WyE6xTd7V1D+ctCpmIzYE/m9OjHkU1AEb4W6MILDUG61uuZKKMMrYhS6YE2CTXqYIw==',
                  },
                  flashName: 'mimil',
                  sizeAndPosition: {
                    left: '75%',
                    top: '65%',
                    width: null,
                    height: null,
                  },
                  isImage: false,
                  isDraggable: true,
                  playSerifTalk: {
                    src: {
                      en: '/api/shared/mp3/talk/mickey/g_mickey_1/g_mickey_1_001.mp3',
                      es: '/api/shared/mp3/talk/mickey/g_mickey_1/es/g_mickey_1_001.mp3',
                    },
                  },
                  talkId: 'default',
                  talkDetail: {
                    textList: [
                      'Okay, let&#39;s begin the <strong>Media Art</strong> Gem Lesson. You&#39;ll be able to make a cool piece of art using programming!',
                    ],
                    arrowDirection: 'right',
                  },
                },
              ],
              enterBehaviourList: [],
              exitCondition: {
                type: 'AND',
                detailList: ['TalkFinish:mimil:default'],
              },
              exitBehaviourList: [],
              metaData: {
                stepId: 2,
                stepType: {
                  type: 'talk',
                  onlyMove: false,
                  talkId: 'default',
                  domId: 'mimil',
                },
                preloadUrlList: [
                  '/api/shared/mp3/talk/mickey/g_mickey_1/g_mickey_1_001.mp3',
                  '/api/shared/mp3/talk/mickey/g_mickey_1/es/g_mickey_1_001.mp3',
                ],
                customUpdateRuleList: [],
                uniqueId:
                  'qNVocsJa9IBwUsOsUIX0WyE6xTd7V1D+ctCpmIzYE/m9OjHkU1AEb4W6MILDUG61uuZKKMMrYhS6YE2CTXqYIw==',
              },
            },
            {
              stepId: 3,
              bgm: {
                src: '/api/shared/mp3/BGM00_gemlesson.mp3',
              },
              defaultNextStepId: 4,
              elementList: [
                {
                  elementName: 'SlideElement',
                  domId: 'slide',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'pptXRuD0Zm4+2OS7vH8SlGHUAB0foWJoEWZKuRa+dWi1JTN3Hay3+pvCFXy4vFX/QcPx/5ui9DSWXa46ljCnQg==',
                  },
                  src: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/png/001.png',
                  zIndex: 25,
                  mask: 'transparent-black-mask',
                  sizeAndPosition: {
                    left: '50%',
                    top: '50%',
                    width: '900px',
                    height: '480px',
                    transform: 'translate(-50%, -50%)',
                  },
                  title: null,
                },
                {
                  elementName: 'FlashElement',
                  domId: 'mimil',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'pptXRuD0Zm4+2OS7vH8SlGHUAB0foWJoEWZKuRa+dWi1JTN3Hay3+pvCFXy4vFX/QcPx/5ui9DSWXa46ljCnQg==',
                  },
                  flashName: 'mimil',
                  sizeAndPosition: {
                    left: '75%',
                    top: '65%',
                    width: null,
                    height: null,
                  },
                  isImage: false,
                  isDraggable: true,
                },
              ],
              enterBehaviourList: [],
              exitCondition: {},
              exitBehaviourList: [],
              metaData: {
                stepId: 3,
                stepType: {
                  type: 'talk',
                  onlyMove: true,
                },
                preloadUrlList: [],
                customUpdateRuleList: [],
                uniqueId:
                  'pptXRuD0Zm4+2OS7vH8SlGHUAB0foWJoEWZKuRa+dWi1JTN3Hay3+pvCFXy4vFX/QcPx/5ui9DSWXa46ljCnQg==',
              },
            },
            {
              stepId: 4,
              bgm: {
                src: '/api/shared/mp3/BGM00_gemlesson.mp3',
              },
              defaultNextStepId: 5,
              elementList: [
                {
                  elementName: 'SlideElement',
                  domId: 'slide',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'pptXRuD0Zm4+2OS7vH8SlGHUAB0foWJoEWZKuRa+dWi1JTN3Hay3+pvCFXy4vFX/QcPx/5ui9DSWXa46ljCnQg==',
                  },
                  src: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/png/001.png',
                  zIndex: 25,
                  mask: 'transparent-black-mask',
                  sizeAndPosition: {
                    left: '50%',
                    top: '50%',
                    width: '900px',
                    height: '480px',
                    transform: 'translate(-50%, -50%)',
                  },
                  title: null,
                },
                {
                  elementName: 'FlashElement',
                  domId: 'mimil',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'pptXRuD0Zm4+2OS7vH8SlGHUAB0foWJoEWZKuRa+dWi1JTN3Hay3+pvCFXy4vFX/QcPx/5ui9DSWXa46ljCnQg==',
                  },
                  flashName: 'mimil',
                  sizeAndPosition: {
                    left: '75%',
                    top: '65%',
                    width: null,
                    height: null,
                  },
                  isImage: false,
                  isDraggable: true,
                  playSerifTalk: {
                    src: {
                      en: '/api/shared/mp3/talk/mickey/g_mickey_1/g_mickey_1_002.mp3',
                      es: '/api/shared/mp3/talk/mickey/g_mickey_1/es/g_mickey_1_002.mp3',
                    },
                  },
                  talkId: 'default',
                  talkDetail: {
                    textList: ['Let&#39;s start by learning circle magic.'],
                    arrowDirection: 'right',
                  },
                },
              ],
              enterBehaviourList: [],
              exitCondition: {
                type: 'AND',
                detailList: ['TalkFinish:mimil:default'],
              },
              exitBehaviourList: [],
              metaData: {
                stepId: 4,
                stepType: {
                  type: 'talk',
                  onlyMove: false,
                  talkId: 'default',
                  domId: 'mimil',
                },
                preloadUrlList: [
                  '/api/shared/mp3/talk/mickey/g_mickey_1/g_mickey_1_002.mp3',
                  '/api/shared/mp3/talk/mickey/g_mickey_1/es/g_mickey_1_002.mp3',
                ],
                customUpdateRuleList: [],
                uniqueId:
                  'pptXRuD0Zm4+2OS7vH8SlGHUAB0foWJoEWZKuRa+dWi1JTN3Hay3+pvCFXy4vFX/QcPx/5ui9DSWXa46ljCnQg==',
              },
            },
            {
              stepId: 5,
              bgm: {
                src: '/api/shared/mp3/BGM00_gemlesson.mp3',
              },
              defaultNextStepId: 6,
              elementList: [
                {
                  elementName: 'FlashElement',
                  domId: 'mimil',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'rodMSnx2iv468eIB434XHm8lVG7hKKCLFWFam99sKBCnB5CiAOGjkzzjs3VDj6psWeHzKG9xo6xbCXg1HBwHbw==',
                  },
                  flashName: 'mimil',
                  sizeAndPosition: {
                    left: '75%',
                    top: '65%',
                    width: null,
                    height: null,
                  },
                  isImage: false,
                  isDraggable: true,
                },
                {
                  elementName: 'DevelopWindowsElement',
                  domId: 'lesson-develop-windows',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'rodMSnx2iv468eIB434XHm8lVG7hKKCLFWFam99sKBCnB5CiAOGjkzzjs3VDj6psWeHzKG9xo6xbCXg1HBwHbw==',
                  },
                  editorWindowsList: [
                    [
                      {
                        windowId: 'Editor1',
                        sizeAndPosition: {
                          height: '58.5%',
                          width: '41%',
                          top: '41.5%',
                          left: '59%',
                        },
                        theme: 'chaos',
                        highlightCssClass: 'flash-dark',
                        onFocusCssClass: 'normal-highlight',
                        editAreaList: [],
                        mode: 'javascript',
                        file: 'top_editor.js',
                        tabName: 'JavaScript',
                        editorWindowId: 'Editor',
                        tabSelected: true,
                      },
                    ],
                  ],
                  previewWindowList: [
                    {
                      windowId: 'preview',
                      sizeAndPosition: {
                        top: '0%',
                        left: '0%',
                        width: '58%',
                        height: '100%',
                      },
                      file: 'lesson00-main.html',
                    },
                  ],
                  snap: 'lesson00-main',
                },
                {
                  elementName: 'FlipCardElement',
                  domId: 'lesson-hint',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'rodMSnx2iv468eIB434XHm8lVG7hKKCLFWFam99sKBCnB5CiAOGjkzzjs3VDj6psWeHzKG9xo6xbCXg1HBwHbw==',
                  },
                  cardContentUrlList: [
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson00-main_1.html',
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson00-main_2.html',
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson00-main_3.html',
                  ],
                  flipButtonText: ['ヒントを見る', '次のヒント'],
                  sizeAndPosition: {
                    height: '40%',
                    width: '41%',
                    top: '0%',
                    left: '59%',
                  },
                  guideButtons: {
                    hintTalk: {
                      src: [
                        {
                          en: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/g_mickey_1_hint_001.mp3',
                          es: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/es/g_mickey_1_hint_001.mp3',
                        },
                      ],
                      className: 'hint-talk',
                      icon: 'volume-up',
                    },
                  },
                },
              ],
              enterBehaviourList: [],
              exitCondition: {},
              exitBehaviourList: [],
              metaData: {
                stepId: 5,
                stepType: {
                  type: 'lesson',
                  snapType: '',
                  layout: 'ERH1',
                },
                preloadUrlList: [
                  '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/g_mickey_1_hint_001.mp3',
                  '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/es/g_mickey_1_hint_001.mp3',
                  '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson00-main_1.html',
                  '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson00-main_2.html',
                  '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson00-main_3.html',
                ],
                customUpdateRuleList: [],
                stepLabel: '',
                lessonName: '',
                isLesson: false,
                uniqueId:
                  'rodMSnx2iv468eIB434XHm8lVG7hKKCLFWFam99sKBCnB5CiAOGjkzzjs3VDj6psWeHzKG9xo6xbCXg1HBwHbw==',
              },
            },
            {
              stepId: 6,
              bgm: {
                src: '/api/shared/mp3/BGM00_gemlesson.mp3',
              },
              defaultNextStepId: 7,
              elementList: [
                {
                  elementName: 'FlashElement',
                  domId: 'mimil',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      '1ipXxVTeZc6ycTVw+nut9C7wQqfgAdEawehkDtelsIhYgJzwlw6sehiGbxxPrHycBu5IgyoS3X12DZijjnUdYQ==',
                  },
                  flashName: 'mimil',
                  sizeAndPosition: {
                    left: '75%',
                    top: '65%',
                    width: null,
                    height: null,
                  },
                  isImage: false,
                  isDraggable: true,
                },
                {
                  elementName: 'DevelopWindowsElement',
                  domId: 'lesson-develop-windows',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      '1ipXxVTeZc6ycTVw+nut9C7wQqfgAdEawehkDtelsIhYgJzwlw6sehiGbxxPrHycBu5IgyoS3X12DZijjnUdYQ==',
                  },
                  editorWindowsList: [
                    [
                      {
                        windowId: 'Editor1',
                        sizeAndPosition: {
                          height: '58.5%',
                          width: '41%',
                          top: '41.5%',
                          left: '59%',
                        },
                        theme: 'chaos',
                        highlightCssClass: 'flash-dark',
                        onFocusCssClass: 'normal-highlight',
                        editAreaList: [],
                        mode: 'javascript',
                        file: 'top_editor.js',
                        tabName: 'JavaScript',
                        editorWindowId: 'Editor',
                        tabSelected: true,
                      },
                    ],
                  ],
                  previewWindowList: [
                    {
                      windowId: 'preview',
                      sizeAndPosition: {
                        top: '0%',
                        left: '0%',
                        width: '58%',
                        height: '100%',
                      },
                      file: 'lesson00-main.html',
                    },
                  ],
                  snap: 'lesson00-main',
                },
                {
                  elementName: 'FlipCardElement',
                  domId: 'lesson-hint',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      '1ipXxVTeZc6ycTVw+nut9C7wQqfgAdEawehkDtelsIhYgJzwlw6sehiGbxxPrHycBu5IgyoS3X12DZijjnUdYQ==',
                  },
                  cardContentUrlList: [
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson00-main_1.html',
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson00-main_2.html',
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson00-main_3.html',
                  ],
                  flipButtonText: ['ヒントを見る', '次のヒント'],
                  sizeAndPosition: {
                    height: '40%',
                    width: '41%',
                    top: '0%',
                    left: '59%',
                  },
                  guideButtons: {
                    hintTalk: {
                      src: [
                        {
                          en: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/g_mickey_1_hint_001.mp3',
                          es: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/es/g_mickey_1_hint_001.mp3',
                        },
                      ],
                      className: 'hint-talk',
                      icon: 'volume-up',
                    },
                  },
                },
              ],
              enterBehaviourList: [],
              exitCondition: {},
              exitBehaviourList: [],
              metaData: {
                stepId: 6,
                stepType: {
                  type: 'talk',
                  snapType: '',
                  layout: 'ERH1',
                  onlyMove: true,
                },
                preloadUrlList: [],
                customUpdateRuleList: [],
                uniqueId:
                  '1ipXxVTeZc6ycTVw+nut9C7wQqfgAdEawehkDtelsIhYgJzwlw6sehiGbxxPrHycBu5IgyoS3X12DZijjnUdYQ==',
              },
            },
            {
              stepId: 7,
              bgm: {
                src: '/api/shared/mp3/BGM00_gemlesson.mp3',
              },
              defaultNextStepId: 8,
              elementList: [
                {
                  elementName: 'FlashElement',
                  domId: 'mimil',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      '1ipXxVTeZc6ycTVw+nut9C7wQqfgAdEawehkDtelsIhYgJzwlw6sehiGbxxPrHycBu5IgyoS3X12DZijjnUdYQ==',
                  },
                  flashName: 'mimil',
                  sizeAndPosition: {
                    left: '75%',
                    top: '65%',
                    width: null,
                    height: null,
                  },
                  isImage: false,
                  isDraggable: true,
                  playSerifTalk: {
                    src: {
                      en: '/api/shared/mp3/talk/mickey/g_mickey_1/g_mickey_1_003.mp3',
                      es: '/api/shared/mp3/talk/mickey/g_mickey_1/es/g_mickey_1_003.mp3',
                    },
                  },
                  talkId: 'default',
                  talkDetail: {
                    textList: ['Okay, let me explain the screen.'],
                    arrowDirection: 'right',
                  },
                },
                {
                  elementName: 'DevelopWindowsElement',
                  domId: 'lesson-develop-windows',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      '1ipXxVTeZc6ycTVw+nut9C7wQqfgAdEawehkDtelsIhYgJzwlw6sehiGbxxPrHycBu5IgyoS3X12DZijjnUdYQ==',
                  },
                  editorWindowsList: [
                    [
                      {
                        windowId: 'Editor1',
                        sizeAndPosition: {
                          height: '58.5%',
                          width: '41%',
                          top: '41.5%',
                          left: '59%',
                        },
                        theme: 'chaos',
                        highlightCssClass: 'flash-dark',
                        onFocusCssClass: 'normal-highlight',
                        editAreaList: [],
                        mode: 'javascript',
                        file: 'top_editor.js',
                        tabName: 'JavaScript',
                        editorWindowId: 'Editor',
                        tabSelected: true,
                      },
                    ],
                  ],
                  previewWindowList: [
                    {
                      windowId: 'preview',
                      sizeAndPosition: {
                        top: '0%',
                        left: '0%',
                        width: '58%',
                        height: '100%',
                      },
                      file: 'lesson00-main.html',
                    },
                  ],
                  snap: 'lesson00-main',
                },
                {
                  elementName: 'FlipCardElement',
                  domId: 'lesson-hint',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      '1ipXxVTeZc6ycTVw+nut9C7wQqfgAdEawehkDtelsIhYgJzwlw6sehiGbxxPrHycBu5IgyoS3X12DZijjnUdYQ==',
                  },
                  cardContentUrlList: [
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson00-main_1.html',
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson00-main_2.html',
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson00-main_3.html',
                  ],
                  flipButtonText: ['ヒントを見る', '次のヒント'],
                  sizeAndPosition: {
                    height: '40%',
                    width: '41%',
                    top: '0%',
                    left: '59%',
                  },
                  guideButtons: {
                    hintTalk: {
                      src: [
                        {
                          en: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/g_mickey_1_hint_001.mp3',
                          es: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/es/g_mickey_1_hint_001.mp3',
                        },
                      ],
                      className: 'hint-talk',
                      icon: 'volume-up',
                    },
                  },
                },
              ],
              enterBehaviourList: [],
              exitCondition: {
                type: 'AND',
                detailList: ['TalkFinish:mimil:default'],
              },
              exitBehaviourList: [],
              metaData: {
                stepId: 7,
                stepType: {
                  type: 'talk',
                  snapType: '',
                  layout: 'ERH1',
                  onlyMove: false,
                  talkId: 'default',
                  domId: 'mimil',
                },
                preloadUrlList: [
                  '/api/shared/mp3/talk/mickey/g_mickey_1/g_mickey_1_003.mp3',
                  '/api/shared/mp3/talk/mickey/g_mickey_1/es/g_mickey_1_003.mp3',
                ],
                customUpdateRuleList: [],
                uniqueId:
                  '1ipXxVTeZc6ycTVw+nut9C7wQqfgAdEawehkDtelsIhYgJzwlw6sehiGbxxPrHycBu5IgyoS3X12DZijjnUdYQ==',
              },
            },
            {
              stepId: 8,
              bgm: {
                src: '/api/shared/mp3/BGM00_gemlesson.mp3',
              },
              defaultNextStepId: 9,
              elementList: [
                {
                  elementName: 'FlashElement',
                  domId: 'mimil',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'Ukg0sPJLlmzsV+xufruF7bg+yOUw874hUhgcbvJmGWiD9vHxUQ1lAUnTaFtgeS000TyxepaVMTjDM2r+UviDzA==',
                  },
                  flashName: 'mimil',
                  sizeAndPosition: {
                    left: '75%',
                    top: '65%',
                    width: null,
                    height: null,
                  },
                  isImage: false,
                  isDraggable: true,
                },
                {
                  elementName: 'DevelopWindowsElement',
                  domId: 'lesson-develop-windows',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'Ukg0sPJLlmzsV+xufruF7bg+yOUw874hUhgcbvJmGWiD9vHxUQ1lAUnTaFtgeS000TyxepaVMTjDM2r+UviDzA==',
                  },
                  editorWindowsList: [
                    [
                      {
                        windowId: 'Editor1',
                        sizeAndPosition: {
                          height: '58.5%',
                          width: '41%',
                          top: '41.5%',
                          left: '59%',
                        },
                        theme: 'chaos',
                        highlightCssClass: 'flash-dark',
                        onFocusCssClass: 'normal-highlight',
                        editAreaList: [],
                        mode: 'javascript',
                        file: 'top_editor.js',
                        tabName: 'JavaScript',
                        editorWindowId: 'Editor',
                        tabSelected: true,
                      },
                    ],
                  ],
                  previewWindowList: [
                    {
                      windowId: 'preview',
                      sizeAndPosition: {
                        top: '0%',
                        left: '0%',
                        width: '58%',
                        height: '100%',
                      },
                      file: 'lesson00-main.html',
                    },
                  ],
                  snap: 'lesson00-main',
                },
                {
                  elementName: 'FlipCardElement',
                  domId: 'lesson-hint',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'Ukg0sPJLlmzsV+xufruF7bg+yOUw874hUhgcbvJmGWiD9vHxUQ1lAUnTaFtgeS000TyxepaVMTjDM2r+UviDzA==',
                  },
                  cardContentUrlList: [
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson00-main_1.html',
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson00-main_2.html',
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson00-main_3.html',
                  ],
                  flipButtonText: ['ヒントを見る', '次のヒント'],
                  sizeAndPosition: {
                    height: '40%',
                    width: '41%',
                    top: '0%',
                    left: '59%',
                  },
                  guideButtons: {
                    hintTalk: {
                      src: [
                        {
                          en: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/g_mickey_1_hint_001.mp3',
                          es: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/es/g_mickey_1_hint_001.mp3',
                        },
                      ],
                      className: 'hint-talk',
                      icon: 'volume-up',
                    },
                  },
                },
              ],
              enterBehaviourList: [],
              exitCondition: {},
              exitBehaviourList: [],
              metaData: {
                stepId: 8,
                stepType: {
                  type: 'talk',
                  snapType: '',
                  layout: 'ERH1',
                  onlyMove: true,
                },
                preloadUrlList: [],
                customUpdateRuleList: [],
                uniqueId:
                  'Ukg0sPJLlmzsV+xufruF7bg+yOUw874hUhgcbvJmGWiD9vHxUQ1lAUnTaFtgeS000TyxepaVMTjDM2r+UviDzA==',
              },
            },
            {
              stepId: 9,
              bgm: {
                src: '/api/shared/mp3/BGM00_gemlesson.mp3',
              },
              defaultNextStepId: 10,
              elementList: [
                {
                  elementName: 'FlashElement',
                  domId: 'mimil',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'Ukg0sPJLlmzsV+xufruF7bg+yOUw874hUhgcbvJmGWiD9vHxUQ1lAUnTaFtgeS000TyxepaVMTjDM2r+UviDzA==',
                  },
                  flashName: 'mimil',
                  sizeAndPosition: {
                    left: '75%',
                    top: '65%',
                    width: null,
                    height: null,
                  },
                  isImage: false,
                  isDraggable: true,
                  playSerifTalk: {
                    src: {
                      en: '/api/shared/mp3/talk/mickey/g_mickey_1/g_mickey_1_004.mp3',
                      es: '/api/shared/mp3/talk/mickey/g_mickey_1/es/g_mickey_1_004.mp3',
                    },
                  },
                  talkId: 'default',
                  talkDetail: {
                    textList: [
                      'This is the <strong>code window</strong>. This is where you write the code for your program. The act of that is called <strong>coding</strong>.',
                    ],
                    arrowDirection: 'right',
                  },
                },
                {
                  elementName: 'DevelopWindowsElement',
                  domId: 'lesson-develop-windows',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'Ukg0sPJLlmzsV+xufruF7bg+yOUw874hUhgcbvJmGWiD9vHxUQ1lAUnTaFtgeS000TyxepaVMTjDM2r+UviDzA==',
                  },
                  editorWindowsList: [
                    [
                      {
                        windowId: 'Editor1',
                        sizeAndPosition: {
                          height: '58.5%',
                          width: '41%',
                          top: '41.5%',
                          left: '59%',
                        },
                        theme: 'chaos',
                        highlightCssClass: 'flash-dark',
                        onFocusCssClass: 'normal-highlight',
                        editAreaList: [],
                        mode: 'javascript',
                        file: 'top_editor.js',
                        tabName: 'JavaScript',
                        editorWindowId: 'Editor',
                        tabSelected: true,
                      },
                    ],
                  ],
                  previewWindowList: [
                    {
                      windowId: 'preview',
                      sizeAndPosition: {
                        top: '0%',
                        left: '0%',
                        width: '58%',
                        height: '100%',
                      },
                      file: 'lesson00-main.html',
                    },
                  ],
                  snap: 'lesson00-main',
                },
                {
                  elementName: 'FlipCardElement',
                  domId: 'lesson-hint',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'Ukg0sPJLlmzsV+xufruF7bg+yOUw874hUhgcbvJmGWiD9vHxUQ1lAUnTaFtgeS000TyxepaVMTjDM2r+UviDzA==',
                  },
                  cardContentUrlList: [
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson00-main_1.html',
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson00-main_2.html',
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson00-main_3.html',
                  ],
                  flipButtonText: ['ヒントを見る', '次のヒント'],
                  sizeAndPosition: {
                    height: '40%',
                    width: '41%',
                    top: '0%',
                    left: '59%',
                  },
                  guideButtons: {
                    hintTalk: {
                      src: [
                        {
                          en: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/g_mickey_1_hint_001.mp3',
                          es: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/es/g_mickey_1_hint_001.mp3',
                        },
                      ],
                      className: 'hint-talk',
                      icon: 'volume-up',
                    },
                  },
                },
              ],
              enterBehaviourList: [],
              exitCondition: {
                type: 'AND',
                detailList: ['TalkFinish:mimil:default'],
              },
              exitBehaviourList: [],
              metaData: {
                stepId: 9,
                stepType: {
                  type: 'talk',
                  snapType: '',
                  layout: 'ERH1',
                  onlyMove: false,
                  talkId: 'default',
                  domId: 'mimil',
                },
                preloadUrlList: [
                  '/api/shared/mp3/talk/mickey/g_mickey_1/g_mickey_1_004.mp3',
                  '/api/shared/mp3/talk/mickey/g_mickey_1/es/g_mickey_1_004.mp3',
                ],
                customUpdateRuleList: [],
                uniqueId:
                  'Ukg0sPJLlmzsV+xufruF7bg+yOUw874hUhgcbvJmGWiD9vHxUQ1lAUnTaFtgeS000TyxepaVMTjDM2r+UviDzA==',
              },
            },
            {
              stepId: 10,
              bgm: {
                src: '/api/shared/mp3/BGM00_gemlesson.mp3',
              },
              defaultNextStepId: 11,
              elementList: [
                {
                  elementName: 'FlashElement',
                  domId: 'mimil',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'EWdROkxBHNh2FFUYdh8cEsLstcBPlf6G5Uy9xt+UjN7dmy/jJIeoc9/e/ddrB0eKPqmI2o6ZMWEX+6TawWG0Aw==',
                  },
                  flashName: 'mimil',
                  sizeAndPosition: {
                    left: '25%',
                    top: '35%',
                    width: null,
                    height: null,
                  },
                  isImage: false,
                  isDraggable: true,
                },
                {
                  elementName: 'DevelopWindowsElement',
                  domId: 'lesson-develop-windows',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'EWdROkxBHNh2FFUYdh8cEsLstcBPlf6G5Uy9xt+UjN7dmy/jJIeoc9/e/ddrB0eKPqmI2o6ZMWEX+6TawWG0Aw==',
                  },
                  editorWindowsList: [
                    [
                      {
                        windowId: 'Editor1',
                        sizeAndPosition: {
                          height: '58.5%',
                          width: '41%',
                          top: '41.5%',
                          left: '59%',
                        },
                        theme: 'chaos',
                        highlightCssClass: 'flash-dark',
                        onFocusCssClass: 'normal-highlight',
                        editAreaList: [],
                        mode: 'javascript',
                        file: 'top_editor.js',
                        tabName: 'JavaScript',
                        editorWindowId: 'Editor',
                        tabSelected: true,
                      },
                    ],
                  ],
                  previewWindowList: [
                    {
                      windowId: 'preview',
                      sizeAndPosition: {
                        top: '0%',
                        left: '0%',
                        width: '58%',
                        height: '100%',
                      },
                      file: 'lesson00-main.html',
                    },
                  ],
                  snap: 'lesson00-main',
                },
                {
                  elementName: 'FlipCardElement',
                  domId: 'lesson-hint',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'EWdROkxBHNh2FFUYdh8cEsLstcBPlf6G5Uy9xt+UjN7dmy/jJIeoc9/e/ddrB0eKPqmI2o6ZMWEX+6TawWG0Aw==',
                  },
                  cardContentUrlList: [
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson00-main_1.html',
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson00-main_2.html',
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson00-main_3.html',
                  ],
                  flipButtonText: ['ヒントを見る', '次のヒント'],
                  sizeAndPosition: {
                    height: '40%',
                    width: '41%',
                    top: '0%',
                    left: '59%',
                  },
                  guideButtons: {
                    hintTalk: {
                      src: [
                        {
                          en: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/g_mickey_1_hint_001.mp3',
                          es: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/es/g_mickey_1_hint_001.mp3',
                        },
                      ],
                      className: 'hint-talk',
                      icon: 'volume-up',
                    },
                  },
                },
              ],
              enterBehaviourList: [],
              exitCondition: {
                type: 'AND',
                detailList: ['AnimationFinish:mimil'],
              },
              exitBehaviourList: [],
              metaData: {
                stepId: 10,
                stepType: {
                  type: 'talk',
                  snapType: '',
                  layout: 'ERH1',
                  onlyMove: true,
                },
                preloadUrlList: [],
                customUpdateRuleList: [],
                uniqueId:
                  'EWdROkxBHNh2FFUYdh8cEsLstcBPlf6G5Uy9xt+UjN7dmy/jJIeoc9/e/ddrB0eKPqmI2o6ZMWEX+6TawWG0Aw==',
              },
            },
            {
              stepId: 11,
              bgm: {
                src: '/api/shared/mp3/BGM00_gemlesson.mp3',
              },
              defaultNextStepId: 12,
              elementList: [
                {
                  elementName: 'FlashElement',
                  domId: 'mimil',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'EWdROkxBHNh2FFUYdh8cEsLstcBPlf6G5Uy9xt+UjN7dmy/jJIeoc9/e/ddrB0eKPqmI2o6ZMWEX+6TawWG0Aw==',
                  },
                  flashName: 'mimil',
                  sizeAndPosition: {
                    left: '25%',
                    top: '35%',
                    width: null,
                    height: null,
                  },
                  isImage: false,
                  isDraggable: true,
                  playSerifTalk: {
                    src: {
                      en: '/api/shared/mp3/talk/mickey/g_mickey_1/g_mickey_1_005.mp3',
                      es: '/api/shared/mp3/talk/mickey/g_mickey_1/es/g_mickey_1_005.mp3',
                    },
                  },
                  talkId: 'default',
                  talkDetail: {
                    textList: [
                      'This is the <strong>preview window</strong>. You can see the results of your code here.',
                    ],
                    arrowDirection: 'left',
                  },
                },
                {
                  elementName: 'DevelopWindowsElement',
                  domId: 'lesson-develop-windows',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'EWdROkxBHNh2FFUYdh8cEsLstcBPlf6G5Uy9xt+UjN7dmy/jJIeoc9/e/ddrB0eKPqmI2o6ZMWEX+6TawWG0Aw==',
                  },
                  editorWindowsList: [
                    [
                      {
                        windowId: 'Editor1',
                        sizeAndPosition: {
                          height: '58.5%',
                          width: '41%',
                          top: '41.5%',
                          left: '59%',
                        },
                        theme: 'chaos',
                        highlightCssClass: 'flash-dark',
                        onFocusCssClass: 'normal-highlight',
                        editAreaList: [],
                        mode: 'javascript',
                        file: 'top_editor.js',
                        tabName: 'JavaScript',
                        editorWindowId: 'Editor',
                        tabSelected: true,
                      },
                    ],
                  ],
                  previewWindowList: [
                    {
                      windowId: 'preview',
                      sizeAndPosition: {
                        top: '0%',
                        left: '0%',
                        width: '58%',
                        height: '100%',
                      },
                      file: 'lesson00-main.html',
                    },
                  ],
                  snap: 'lesson00-main',
                },
                {
                  elementName: 'FlipCardElement',
                  domId: 'lesson-hint',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'EWdROkxBHNh2FFUYdh8cEsLstcBPlf6G5Uy9xt+UjN7dmy/jJIeoc9/e/ddrB0eKPqmI2o6ZMWEX+6TawWG0Aw==',
                  },
                  cardContentUrlList: [
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson00-main_1.html',
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson00-main_2.html',
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson00-main_3.html',
                  ],
                  flipButtonText: ['ヒントを見る', '次のヒント'],
                  sizeAndPosition: {
                    height: '40%',
                    width: '41%',
                    top: '0%',
                    left: '59%',
                  },
                  guideButtons: {
                    hintTalk: {
                      src: [
                        {
                          en: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/g_mickey_1_hint_001.mp3',
                          es: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/es/g_mickey_1_hint_001.mp3',
                        },
                      ],
                      className: 'hint-talk',
                      icon: 'volume-up',
                    },
                  },
                },
              ],
              enterBehaviourList: [],
              exitCondition: {
                type: 'AND',
                detailList: ['TalkFinish:mimil:default'],
              },
              exitBehaviourList: [],
              metaData: {
                stepId: 11,
                stepType: {
                  type: 'talk',
                  snapType: '',
                  layout: 'ERH1',
                  onlyMove: false,
                  talkId: 'default',
                  domId: 'mimil',
                },
                preloadUrlList: [
                  '/api/shared/mp3/talk/mickey/g_mickey_1/g_mickey_1_005.mp3',
                  '/api/shared/mp3/talk/mickey/g_mickey_1/es/g_mickey_1_005.mp3',
                ],
                customUpdateRuleList: [],
                uniqueId:
                  'EWdROkxBHNh2FFUYdh8cEsLstcBPlf6G5Uy9xt+UjN7dmy/jJIeoc9/e/ddrB0eKPqmI2o6ZMWEX+6TawWG0Aw==',
              },
            },
            {
              stepId: 12,
              bgm: {
                src: '/api/shared/mp3/BGM00_gemlesson.mp3',
              },
              defaultNextStepId: 13,
              elementList: [
                {
                  elementName: 'FlashElement',
                  domId: 'mimil',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'LzMbYaU/txUojVpgNLs8InE76w8WFOdcRm+FIPf6wUIQgGz9qZtd3s0Iy+e9KE/mZEMvp5Xido/Xtm3lDGNR1g==',
                  },
                  flashName: 'mimil',
                  sizeAndPosition: {
                    left: '58%',
                    top: '5%',
                    width: null,
                    height: null,
                  },
                  isImage: false,
                  isDraggable: true,
                },
                {
                  elementName: 'DevelopWindowsElement',
                  domId: 'lesson-develop-windows',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'LzMbYaU/txUojVpgNLs8InE76w8WFOdcRm+FIPf6wUIQgGz9qZtd3s0Iy+e9KE/mZEMvp5Xido/Xtm3lDGNR1g==',
                  },
                  editorWindowsList: [
                    [
                      {
                        windowId: 'Editor1',
                        sizeAndPosition: {
                          height: '58.5%',
                          width: '41%',
                          top: '41.5%',
                          left: '59%',
                        },
                        theme: 'chaos',
                        highlightCssClass: 'flash-dark',
                        onFocusCssClass: 'normal-highlight',
                        editAreaList: [],
                        mode: 'javascript',
                        file: 'top_editor.js',
                        tabName: 'JavaScript',
                        editorWindowId: 'Editor',
                        tabSelected: true,
                      },
                    ],
                  ],
                  previewWindowList: [
                    {
                      windowId: 'preview',
                      sizeAndPosition: {
                        top: '0%',
                        left: '0%',
                        width: '58%',
                        height: '100%',
                      },
                      file: 'lesson00-main.html',
                    },
                  ],
                  snap: 'lesson00-main',
                },
                {
                  elementName: 'FlipCardElement',
                  domId: 'lesson-hint',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'LzMbYaU/txUojVpgNLs8InE76w8WFOdcRm+FIPf6wUIQgGz9qZtd3s0Iy+e9KE/mZEMvp5Xido/Xtm3lDGNR1g==',
                  },
                  cardContentUrlList: [
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson00-main_1.html',
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson00-main_2.html',
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson00-main_3.html',
                  ],
                  flipButtonText: ['ヒントを見る', '次のヒント'],
                  sizeAndPosition: {
                    height: '40%',
                    width: '41%',
                    top: '0%',
                    left: '59%',
                  },
                  guideButtons: {
                    hintTalk: {
                      src: [
                        {
                          en: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/g_mickey_1_hint_001.mp3',
                          es: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/es/g_mickey_1_hint_001.mp3',
                        },
                      ],
                      className: 'hint-talk',
                      icon: 'volume-up',
                    },
                  },
                },
              ],
              enterBehaviourList: [],
              exitCondition: {
                type: 'AND',
                detailList: ['AnimationFinish:mimil'],
              },
              exitBehaviourList: [],
              metaData: {
                stepId: 12,
                stepType: {
                  type: 'talk',
                  snapType: '',
                  layout: 'ERH1',
                  onlyMove: true,
                },
                preloadUrlList: [],
                customUpdateRuleList: [],
                uniqueId:
                  'LzMbYaU/txUojVpgNLs8InE76w8WFOdcRm+FIPf6wUIQgGz9qZtd3s0Iy+e9KE/mZEMvp5Xido/Xtm3lDGNR1g==',
              },
            },
            {
              stepId: 13,
              bgm: {
                src: '/api/shared/mp3/BGM00_gemlesson.mp3',
              },
              defaultNextStepId: 14,
              elementList: [
                {
                  elementName: 'FlashElement',
                  domId: 'mimil',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'LzMbYaU/txUojVpgNLs8InE76w8WFOdcRm+FIPf6wUIQgGz9qZtd3s0Iy+e9KE/mZEMvp5Xido/Xtm3lDGNR1g==',
                  },
                  flashName: 'mimil',
                  sizeAndPosition: {
                    left: '58%',
                    top: '5%',
                    width: null,
                    height: null,
                  },
                  isImage: false,
                  isDraggable: true,
                  playSerifTalk: {
                    src: {
                      en: '/api/shared/mp3/talk/mickey/g_mickey_1/g_mickey_1_006.mp3',
                      es: '/api/shared/mp3/talk/mickey/g_mickey_1/es/g_mickey_1_006.mp3',
                    },
                  },
                  talkId: 'default',
                  talkDetail: {
                    textList: [
                      'This is the <strong>hint window</strong>. You can read about your code here.',
                    ],
                    arrowDirection: 'right',
                  },
                },
                {
                  elementName: 'DevelopWindowsElement',
                  domId: 'lesson-develop-windows',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'LzMbYaU/txUojVpgNLs8InE76w8WFOdcRm+FIPf6wUIQgGz9qZtd3s0Iy+e9KE/mZEMvp5Xido/Xtm3lDGNR1g==',
                  },
                  editorWindowsList: [
                    [
                      {
                        windowId: 'Editor1',
                        sizeAndPosition: {
                          height: '58.5%',
                          width: '41%',
                          top: '41.5%',
                          left: '59%',
                        },
                        theme: 'chaos',
                        highlightCssClass: 'flash-dark',
                        onFocusCssClass: 'normal-highlight',
                        editAreaList: [],
                        mode: 'javascript',
                        file: 'top_editor.js',
                        tabName: 'JavaScript',
                        editorWindowId: 'Editor',
                        tabSelected: true,
                      },
                    ],
                  ],
                  previewWindowList: [
                    {
                      windowId: 'preview',
                      sizeAndPosition: {
                        top: '0%',
                        left: '0%',
                        width: '58%',
                        height: '100%',
                      },
                      file: 'lesson00-main.html',
                    },
                  ],
                  snap: 'lesson00-main',
                },
                {
                  elementName: 'FlipCardElement',
                  domId: 'lesson-hint',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'LzMbYaU/txUojVpgNLs8InE76w8WFOdcRm+FIPf6wUIQgGz9qZtd3s0Iy+e9KE/mZEMvp5Xido/Xtm3lDGNR1g==',
                  },
                  cardContentUrlList: [
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson00-main_1.html',
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson00-main_2.html',
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson00-main_3.html',
                  ],
                  flipButtonText: ['ヒントを見る', '次のヒント'],
                  sizeAndPosition: {
                    height: '40%',
                    width: '41%',
                    top: '0%',
                    left: '59%',
                  },
                  guideButtons: {
                    hintTalk: {
                      src: [
                        {
                          en: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/g_mickey_1_hint_001.mp3',
                          es: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/es/g_mickey_1_hint_001.mp3',
                        },
                      ],
                      className: 'hint-talk',
                      icon: 'volume-up',
                    },
                  },
                },
              ],
              enterBehaviourList: [],
              exitCondition: {
                type: 'AND',
                detailList: ['TalkFinish:mimil:default'],
              },
              exitBehaviourList: [],
              metaData: {
                stepId: 13,
                stepType: {
                  type: 'talk',
                  snapType: '',
                  layout: 'ERH1',
                  onlyMove: false,
                  talkId: 'default',
                  domId: 'mimil',
                },
                preloadUrlList: [
                  '/api/shared/mp3/talk/mickey/g_mickey_1/g_mickey_1_006.mp3',
                  '/api/shared/mp3/talk/mickey/g_mickey_1/es/g_mickey_1_006.mp3',
                ],
                customUpdateRuleList: [],
                uniqueId:
                  'LzMbYaU/txUojVpgNLs8InE76w8WFOdcRm+FIPf6wUIQgGz9qZtd3s0Iy+e9KE/mZEMvp5Xido/Xtm3lDGNR1g==',
              },
            },
            {
              stepId: 14,
              bgm: {
                src: '/api/shared/mp3/BGM00_gemlesson.mp3',
              },
              defaultNextStepId: 15,
              elementList: [
                {
                  elementName: 'FlashElement',
                  domId: 'mimil',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'Bc9qP2jalsxW9jYZV9P75a2M7Nw/00MXb06J/B7BSc8MDarfZWVSPE5o8mwvFrC/JjZg9KhvUZU+dpCXh1fkZQ==',
                  },
                  flashName: 'mimil',
                  sizeAndPosition: {
                    left: '58%',
                    top: '5%',
                    width: null,
                    height: null,
                  },
                  isImage: false,
                  isDraggable: true,
                },
                {
                  elementName: 'DevelopWindowsElement',
                  domId: 'lesson-develop-windows',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'Bc9qP2jalsxW9jYZV9P75a2M7Nw/00MXb06J/B7BSc8MDarfZWVSPE5o8mwvFrC/JjZg9KhvUZU+dpCXh1fkZQ==',
                  },
                  editorWindowsList: [
                    [
                      {
                        windowId: 'Editor1',
                        sizeAndPosition: {
                          height: '58.5%',
                          width: '41%',
                          top: '41.5%',
                          left: '59%',
                        },
                        theme: 'chaos',
                        highlightCssClass: 'flash-dark',
                        onFocusCssClass: 'normal-highlight',
                        editAreaList: [],
                        mode: 'javascript',
                        file: 'top_editor.js',
                        tabName: 'JavaScript',
                        editorWindowId: 'Editor',
                        tabSelected: true,
                      },
                    ],
                  ],
                  previewWindowList: [
                    {
                      windowId: 'preview',
                      sizeAndPosition: {
                        top: '0%',
                        left: '0%',
                        width: '58%',
                        height: '100%',
                      },
                      file: 'lesson00-main.html',
                    },
                  ],
                  snap: 'lesson00-main',
                },
                {
                  elementName: 'FlipCardElement',
                  domId: 'lesson-hint',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'Bc9qP2jalsxW9jYZV9P75a2M7Nw/00MXb06J/B7BSc8MDarfZWVSPE5o8mwvFrC/JjZg9KhvUZU+dpCXh1fkZQ==',
                  },
                  cardContentUrlList: [
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson00-main_1.html',
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson00-main_2.html',
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson00-main_3.html',
                  ],
                  flipButtonText: ['ヒントを見る', '次のヒント'],
                  sizeAndPosition: {
                    height: '40%',
                    width: '41%',
                    top: '0%',
                    left: '59%',
                  },
                  guideButtons: {
                    hintTalk: {
                      src: [
                        {
                          en: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/g_mickey_1_hint_001.mp3',
                          es: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/es/g_mickey_1_hint_001.mp3',
                        },
                      ],
                      className: 'hint-talk',
                      icon: 'volume-up',
                    },
                  },
                },
              ],
              enterBehaviourList: [],
              exitCondition: {},
              exitBehaviourList: [],
              metaData: {
                stepId: 14,
                stepType: {
                  type: 'talk',
                  snapType: '',
                  layout: 'ERH1',
                  onlyMove: true,
                },
                preloadUrlList: [],
                customUpdateRuleList: [],
                uniqueId:
                  'Bc9qP2jalsxW9jYZV9P75a2M7Nw/00MXb06J/B7BSc8MDarfZWVSPE5o8mwvFrC/JjZg9KhvUZU+dpCXh1fkZQ==',
              },
            },
            {
              stepId: 15,
              bgm: {
                src: '/api/shared/mp3/BGM00_gemlesson.mp3',
              },
              defaultNextStepId: 16,
              elementList: [
                {
                  elementName: 'FlashElement',
                  domId: 'mimil',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'Bc9qP2jalsxW9jYZV9P75a2M7Nw/00MXb06J/B7BSc8MDarfZWVSPE5o8mwvFrC/JjZg9KhvUZU+dpCXh1fkZQ==',
                  },
                  flashName: 'mimil',
                  sizeAndPosition: {
                    left: '58%',
                    top: '5%',
                    width: null,
                    height: null,
                  },
                  isImage: false,
                  isDraggable: true,
                  playSerifTalk: {
                    src: {
                      en: '/api/shared/mp3/talk/mickey/g_mickey_1/g_mickey_1_007.mp3',
                      es: '/api/shared/mp3/talk/mickey/g_mickey_1/es/g_mickey_1_007.mp3',
                    },
                  },
                  talkId: 'default',
                  talkDetail: {
                    textList: [
                      'When you don&#39;t know something, you can click the <strong>Show Hint</strong> button. Try clicking it right now! It&#39;s to the right of me.',
                    ],
                    arrowDirection: 'right',
                  },
                },
                {
                  elementName: 'DevelopWindowsElement',
                  domId: 'lesson-develop-windows',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'Bc9qP2jalsxW9jYZV9P75a2M7Nw/00MXb06J/B7BSc8MDarfZWVSPE5o8mwvFrC/JjZg9KhvUZU+dpCXh1fkZQ==',
                  },
                  editorWindowsList: [
                    [
                      {
                        windowId: 'Editor1',
                        sizeAndPosition: {
                          height: '58.5%',
                          width: '41%',
                          top: '41.5%',
                          left: '59%',
                        },
                        theme: 'chaos',
                        highlightCssClass: 'flash-dark',
                        onFocusCssClass: 'normal-highlight',
                        editAreaList: [],
                        mode: 'javascript',
                        file: 'top_editor.js',
                        tabName: 'JavaScript',
                        editorWindowId: 'Editor',
                        tabSelected: true,
                      },
                    ],
                  ],
                  previewWindowList: [
                    {
                      windowId: 'preview',
                      sizeAndPosition: {
                        top: '0%',
                        left: '0%',
                        width: '58%',
                        height: '100%',
                      },
                      file: 'lesson00-main.html',
                    },
                  ],
                  snap: 'lesson00-main',
                },
                {
                  elementName: 'FlipCardElement',
                  domId: 'lesson-hint',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'Bc9qP2jalsxW9jYZV9P75a2M7Nw/00MXb06J/B7BSc8MDarfZWVSPE5o8mwvFrC/JjZg9KhvUZU+dpCXh1fkZQ==',
                  },
                  cardContentUrlList: [
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson00-main_1.html',
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson00-main_2.html',
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson00-main_3.html',
                  ],
                  flipButtonText: ['ヒントを見る', '次のヒント'],
                  sizeAndPosition: {
                    height: '40%',
                    width: '41%',
                    top: '0%',
                    left: '59%',
                  },
                  guideButtons: {
                    hintTalk: {
                      src: [
                        {
                          en: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/g_mickey_1_hint_001.mp3',
                          es: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/es/g_mickey_1_hint_001.mp3',
                        },
                      ],
                      className: 'hint-talk',
                      icon: 'volume-up',
                    },
                  },
                },
              ],
              enterBehaviourList: [],
              exitCondition: {
                type: 'AND',
                detailList: ['TalkFinish:mimil:default'],
              },
              exitBehaviourList: [],
              metaData: {
                stepId: 15,
                stepType: {
                  type: 'talk',
                  snapType: '',
                  layout: 'ERH1',
                  onlyMove: false,
                  talkId: 'default',
                  domId: 'mimil',
                },
                preloadUrlList: [
                  '/api/shared/mp3/talk/mickey/g_mickey_1/g_mickey_1_007.mp3',
                  '/api/shared/mp3/talk/mickey/g_mickey_1/es/g_mickey_1_007.mp3',
                ],
                customUpdateRuleList: [],
                uniqueId:
                  'Bc9qP2jalsxW9jYZV9P75a2M7Nw/00MXb06J/B7BSc8MDarfZWVSPE5o8mwvFrC/JjZg9KhvUZU+dpCXh1fkZQ==',
              },
            },
            {
              stepId: 16,
              bgm: {
                src: '/api/shared/mp3/BGM00_gemlesson.mp3',
              },
              defaultNextStepId: 17,
              elementList: [
                {
                  elementName: 'FlashElement',
                  domId: 'mimil',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      '/H3g7M+K8gw4c2xkPTNmkz5t/Cd6K01FvfGYcnb8Uun6JpmjFOTZwUjoG4ooDoXR8ffuJAA35GjzS5OGppc3dg==',
                  },
                  flashName: 'mimil',
                  sizeAndPosition: {
                    left: '58%',
                    top: '5%',
                    width: null,
                    height: null,
                  },
                  isImage: false,
                  isDraggable: true,
                },
                {
                  elementName: 'DevelopWindowsElement',
                  domId: 'lesson-develop-windows',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      '/H3g7M+K8gw4c2xkPTNmkz5t/Cd6K01FvfGYcnb8Uun6JpmjFOTZwUjoG4ooDoXR8ffuJAA35GjzS5OGppc3dg==',
                  },
                  editorWindowsList: [
                    [
                      {
                        windowId: 'Editor1',
                        sizeAndPosition: {
                          height: '58.5%',
                          width: '41%',
                          top: '41.5%',
                          left: '59%',
                        },
                        theme: 'chaos',
                        highlightCssClass: 'flash-dark',
                        onFocusCssClass: 'normal-highlight',
                        editAreaList: [],
                        mode: 'javascript',
                        file: 'top_editor.js',
                        tabName: 'JavaScript',
                        editorWindowId: 'Editor',
                        tabSelected: true,
                      },
                    ],
                  ],
                  previewWindowList: [
                    {
                      windowId: 'preview',
                      sizeAndPosition: {
                        top: '0%',
                        left: '0%',
                        width: '58%',
                        height: '100%',
                      },
                      file: 'lesson00-main.html',
                    },
                  ],
                  snap: 'lesson00-main',
                },
                {
                  elementName: 'FlipCardElement',
                  domId: 'lesson-hint',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      '/H3g7M+K8gw4c2xkPTNmkz5t/Cd6K01FvfGYcnb8Uun6JpmjFOTZwUjoG4ooDoXR8ffuJAA35GjzS5OGppc3dg==',
                  },
                  cardContentUrlList: [
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson00-main_1.html',
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson00-main_2.html',
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson00-main_3.html',
                  ],
                  flipButtonText: ['ヒントを見る', '次のヒント'],
                  sizeAndPosition: {
                    height: '40%',
                    width: '41%',
                    top: '0%',
                    left: '59%',
                  },
                  guideButtons: {
                    hintTalk: {
                      src: [
                        {
                          en: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/g_mickey_1_hint_001.mp3',
                          es: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/es/g_mickey_1_hint_001.mp3',
                        },
                      ],
                      className: 'hint-talk',
                      icon: 'volume-up',
                    },
                  },
                },
              ],
              enterBehaviourList: [],
              exitCondition: {},
              exitBehaviourList: [],
              metaData: {
                stepId: 16,
                stepType: {
                  type: 'talk',
                  snapType: '',
                  layout: 'ERH1',
                  onlyMove: true,
                },
                preloadUrlList: [],
                customUpdateRuleList: [],
                uniqueId:
                  '/H3g7M+K8gw4c2xkPTNmkz5t/Cd6K01FvfGYcnb8Uun6JpmjFOTZwUjoG4ooDoXR8ffuJAA35GjzS5OGppc3dg==',
              },
            },
            {
              stepId: 17,
              bgm: {
                src: '/api/shared/mp3/BGM00_gemlesson.mp3',
              },
              defaultNextStepId: 18,
              elementList: [
                {
                  elementName: 'FlashElement',
                  domId: 'mimil',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      '/H3g7M+K8gw4c2xkPTNmkz5t/Cd6K01FvfGYcnb8Uun6JpmjFOTZwUjoG4ooDoXR8ffuJAA35GjzS5OGppc3dg==',
                  },
                  flashName: 'mimil',
                  sizeAndPosition: {
                    left: '58%',
                    top: '5%',
                    width: null,
                    height: null,
                  },
                  isImage: false,
                  isDraggable: true,
                  playSerifTalk: {
                    src: {
                      en: '/api/shared/mp3/talk/mickey/g_mickey_1/g_mickey_1_008.mp3',
                      es: '/api/shared/mp3/talk/mickey/g_mickey_1/es/g_mickey_1_008.mp3',
                    },
                  },
                  talkId: 'default',
                  talkDetail: {
                    textList: [
                      'The text in the hint window changed. You should make a mental note to use the <strong>Show Hint</strong> button when you&#39;re stuck!',
                    ],
                    arrowDirection: 'right',
                  },
                },
                {
                  elementName: 'DevelopWindowsElement',
                  domId: 'lesson-develop-windows',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      '/H3g7M+K8gw4c2xkPTNmkz5t/Cd6K01FvfGYcnb8Uun6JpmjFOTZwUjoG4ooDoXR8ffuJAA35GjzS5OGppc3dg==',
                  },
                  editorWindowsList: [
                    [
                      {
                        windowId: 'Editor1',
                        sizeAndPosition: {
                          height: '58.5%',
                          width: '41%',
                          top: '41.5%',
                          left: '59%',
                        },
                        theme: 'chaos',
                        highlightCssClass: 'flash-dark',
                        onFocusCssClass: 'normal-highlight',
                        editAreaList: [],
                        mode: 'javascript',
                        file: 'top_editor.js',
                        tabName: 'JavaScript',
                        editorWindowId: 'Editor',
                        tabSelected: true,
                      },
                    ],
                  ],
                  previewWindowList: [
                    {
                      windowId: 'preview',
                      sizeAndPosition: {
                        top: '0%',
                        left: '0%',
                        width: '58%',
                        height: '100%',
                      },
                      file: 'lesson00-main.html',
                    },
                  ],
                  snap: 'lesson00-main',
                },
                {
                  elementName: 'FlipCardElement',
                  domId: 'lesson-hint',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      '/H3g7M+K8gw4c2xkPTNmkz5t/Cd6K01FvfGYcnb8Uun6JpmjFOTZwUjoG4ooDoXR8ffuJAA35GjzS5OGppc3dg==',
                  },
                  cardContentUrlList: [
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson00-main_1.html',
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson00-main_2.html',
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson00-main_3.html',
                  ],
                  flipButtonText: ['ヒントを見る', '次のヒント'],
                  sizeAndPosition: {
                    height: '40%',
                    width: '41%',
                    top: '0%',
                    left: '59%',
                  },
                  guideButtons: {
                    hintTalk: {
                      src: [
                        {
                          en: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/g_mickey_1_hint_001.mp3',
                          es: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/es/g_mickey_1_hint_001.mp3',
                        },
                      ],
                      className: 'hint-talk',
                      icon: 'volume-up',
                    },
                  },
                },
              ],
              enterBehaviourList: [],
              exitCondition: {
                type: 'AND',
                detailList: ['TalkFinish:mimil:default'],
              },
              exitBehaviourList: [],
              metaData: {
                stepId: 17,
                stepType: {
                  type: 'talk',
                  snapType: '',
                  layout: 'ERH1',
                  onlyMove: false,
                  talkId: 'default',
                  domId: 'mimil',
                },
                preloadUrlList: [
                  '/api/shared/mp3/talk/mickey/g_mickey_1/g_mickey_1_008.mp3',
                  '/api/shared/mp3/talk/mickey/g_mickey_1/es/g_mickey_1_008.mp3',
                ],
                customUpdateRuleList: [],
                uniqueId:
                  '/H3g7M+K8gw4c2xkPTNmkz5t/Cd6K01FvfGYcnb8Uun6JpmjFOTZwUjoG4ooDoXR8ffuJAA35GjzS5OGppc3dg==',
              },
            },
            {
              stepId: 18,
              bgm: {
                src: '/api/shared/mp3/BGM00_gemlesson.mp3',
              },
              defaultNextStepId: 19,
              elementList: [
                {
                  elementName: 'FlashElement',
                  domId: 'mimil',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'mg6akQ5VS+48nBPD11XiU//0/XixNkOkPtiT9qRAhb84eeNelUQPMqqnRVLvpmkTAF4/VN69cCQ3GrFyztPqvA==',
                  },
                  flashName: 'mimil',
                  sizeAndPosition: {
                    left: '58%',
                    top: '5%',
                    width: null,
                    height: null,
                  },
                  isImage: false,
                  isDraggable: true,
                },
                {
                  elementName: 'DevelopWindowsElement',
                  domId: 'lesson-develop-windows',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'mg6akQ5VS+48nBPD11XiU//0/XixNkOkPtiT9qRAhb84eeNelUQPMqqnRVLvpmkTAF4/VN69cCQ3GrFyztPqvA==',
                  },
                  editorWindowsList: [
                    [
                      {
                        windowId: 'Editor1',
                        sizeAndPosition: {
                          height: '58.5%',
                          width: '41%',
                          top: '41.5%',
                          left: '59%',
                        },
                        theme: 'chaos',
                        highlightCssClass: 'flash-dark',
                        onFocusCssClass: 'normal-highlight',
                        editAreaList: [],
                        mode: 'javascript',
                        file: 'top_editor.js',
                        tabName: 'JavaScript',
                        editorWindowId: 'Editor',
                        tabSelected: true,
                      },
                    ],
                  ],
                  previewWindowList: [
                    {
                      windowId: 'preview',
                      sizeAndPosition: {
                        top: '0%',
                        left: '0%',
                        width: '58%',
                        height: '100%',
                      },
                      file: 'lesson01-begin.html',
                    },
                  ],
                  snap: 'lesson01-begin',
                },
                {
                  elementName: 'FlipCardElement',
                  domId: 'lesson-hint',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'mg6akQ5VS+48nBPD11XiU//0/XixNkOkPtiT9qRAhb84eeNelUQPMqqnRVLvpmkTAF4/VN69cCQ3GrFyztPqvA==',
                  },
                  cardContentUrlList: [
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson01-begin_1.html',
                  ],
                  flipButtonText: ['ヒントを見る', '次のヒント'],
                  sizeAndPosition: {
                    height: '40%',
                    width: '41%',
                    top: '0%',
                    left: '59%',
                  },
                  guideButtons: {
                    hintTalk: {
                      src: [
                        {
                          en: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/g_mickey_1_hint_002.mp3',
                          es: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/es/g_mickey_1_hint_002.mp3',
                        },
                      ],
                      className: 'hint-talk',
                      icon: 'volume-up',
                    },
                  },
                },
              ],
              enterBehaviourList: [],
              exitCondition: {},
              exitBehaviourList: [],
              metaData: {
                stepId: 18,
                stepType: {
                  type: 'lesson',
                  snapType: 'begin',
                  layout: 'ERH1',
                },
                preloadUrlList: [
                  '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/g_mickey_1_hint_002.mp3',
                  '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/es/g_mickey_1_hint_002.mp3',
                  '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson01-begin_1.html',
                ],
                customUpdateRuleList: [],
                stepLabel: '',
                lessonName: 'Create a circle',
                isLesson: true,
                uniqueId:
                  'mg6akQ5VS+48nBPD11XiU//0/XixNkOkPtiT9qRAhb84eeNelUQPMqqnRVLvpmkTAF4/VN69cCQ3GrFyztPqvA==',
              },
            },
            {
              stepId: 19,
              bgm: {
                src: '/api/shared/mp3/BGM00_gemlesson.mp3',
              },
              defaultNextStepId: 20,
              elementList: [
                {
                  elementName: 'FlashElement',
                  domId: 'mimil',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'L1cNu3w+q6qexiHAeCj8sde3ZbkGteo0sGBqHdxfZMUsj9SYM274j8a49xVz7tV/x60xzTV8tEQHnFk/eOJgqg==',
                  },
                  flashName: 'mimil',
                  sizeAndPosition: {
                    left: '58%',
                    top: '5%',
                    width: null,
                    height: null,
                  },
                  isImage: false,
                  isDraggable: true,
                  playSerifTalk: {
                    src: {
                      en: '/api/shared/mp3/talk/mickey/g_mickey_1/g_mickey_1_009.mp3',
                      es: '/api/shared/mp3/talk/mickey/g_mickey_1/es/g_mickey_1_009.mp3',
                    },
                  },
                  talkId: 'default',
                  talkDetail: {
                    textList: ['Okay, let&#39;s start the lesson!'],
                    arrowDirection: 'right',
                  },
                },
                {
                  elementName: 'DevelopWindowsElement',
                  domId: 'lesson-develop-windows',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'L1cNu3w+q6qexiHAeCj8sde3ZbkGteo0sGBqHdxfZMUsj9SYM274j8a49xVz7tV/x60xzTV8tEQHnFk/eOJgqg==',
                  },
                  editorWindowsList: [
                    [
                      {
                        windowId: 'Editor1',
                        sizeAndPosition: {
                          height: '58.5%',
                          width: '41%',
                          top: '41.5%',
                          left: '59%',
                        },
                        theme: 'chaos',
                        highlightCssClass: 'flash-dark',
                        onFocusCssClass: 'normal-highlight',
                        editAreaList: [],
                        mode: 'javascript',
                        file: 'top_editor.js',
                        tabName: 'JavaScript',
                        editorWindowId: 'Editor',
                        tabSelected: true,
                      },
                    ],
                  ],
                  previewWindowList: [
                    {
                      windowId: 'preview',
                      sizeAndPosition: {
                        top: '0%',
                        left: '0%',
                        width: '58%',
                        height: '100%',
                      },
                      file: 'lesson01-begin.html',
                    },
                  ],
                  snap: 'lesson01-begin',
                },
                {
                  elementName: 'FlipCardElement',
                  domId: 'lesson-hint',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'L1cNu3w+q6qexiHAeCj8sde3ZbkGteo0sGBqHdxfZMUsj9SYM274j8a49xVz7tV/x60xzTV8tEQHnFk/eOJgqg==',
                  },
                  cardContentUrlList: [
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson01-begin_1.html',
                  ],
                  flipButtonText: ['ヒントを見る', '次のヒント'],
                  sizeAndPosition: {
                    height: '40%',
                    width: '41%',
                    top: '0%',
                    left: '59%',
                  },
                  guideButtons: {
                    hintTalk: {
                      src: [
                        {
                          en: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/g_mickey_1_hint_002.mp3',
                          es: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/es/g_mickey_1_hint_002.mp3',
                        },
                      ],
                      className: 'hint-talk',
                      icon: 'volume-up',
                    },
                  },
                },
              ],
              enterBehaviourList: [],
              exitCondition: {
                type: 'AND',
                detailList: ['TalkFinish:mimil:default'],
              },
              exitBehaviourList: [],
              metaData: {
                stepId: 19,
                stepType: {
                  type: 'talk',
                  snapType: 'begin',
                  layout: 'ERH1',
                  onlyMove: false,
                  talkId: 'default',
                  domId: 'mimil',
                },
                preloadUrlList: [
                  '/api/shared/mp3/talk/mickey/g_mickey_1/g_mickey_1_009.mp3',
                  '/api/shared/mp3/talk/mickey/g_mickey_1/es/g_mickey_1_009.mp3',
                ],
                customUpdateRuleList: [],
                uniqueId:
                  'L1cNu3w+q6qexiHAeCj8sde3ZbkGteo0sGBqHdxfZMUsj9SYM274j8a49xVz7tV/x60xzTV8tEQHnFk/eOJgqg==',
              },
            },
            {
              stepId: 20,
              bgm: {
                src: '/api/shared/mp3/BGM00_gemlesson.mp3',
              },
              defaultNextStepId: 21,
              elementList: [
                {
                  elementName: 'FlashElement',
                  domId: 'mimil',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'F260cC0YTYx78h2oOwsUuNEIaq6FIj9iVYsjnQhTl0QAesxzx5JS9jiFFshLsezAsp7xbREr9V2ixi68lDdekg==',
                  },
                  flashName: 'mimil',
                  sizeAndPosition: {
                    left: '80%',
                    top: '15%',
                    width: null,
                    height: null,
                  },
                  isImage: false,
                  isDraggable: true,
                },
                {
                  elementName: 'DevelopWindowsElement',
                  domId: 'lesson-develop-windows',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'F260cC0YTYx78h2oOwsUuNEIaq6FIj9iVYsjnQhTl0QAesxzx5JS9jiFFshLsezAsp7xbREr9V2ixi68lDdekg==',
                  },
                  editorWindowsList: [
                    [
                      {
                        windowId: 'Editor1',
                        sizeAndPosition: {
                          height: '58.5%',
                          width: '41%',
                          top: '41.5%',
                          left: '59%',
                        },
                        theme: 'chaos',
                        highlightCssClass: 'flash-dark',
                        onFocusCssClass: 'normal-highlight',
                        editAreaList: [],
                        mode: 'javascript',
                        file: 'top_editor.js',
                        tabName: 'JavaScript',
                        editorWindowId: 'Editor',
                        tabSelected: true,
                      },
                    ],
                  ],
                  previewWindowList: [
                    {
                      windowId: 'preview',
                      sizeAndPosition: {
                        top: '0%',
                        left: '0%',
                        width: '58%',
                        height: '100%',
                      },
                      file: 'lesson01-begin.html',
                    },
                  ],
                  snap: 'lesson01-begin',
                },
                {
                  elementName: 'FlipCardElement',
                  domId: 'lesson-hint',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'F260cC0YTYx78h2oOwsUuNEIaq6FIj9iVYsjnQhTl0QAesxzx5JS9jiFFshLsezAsp7xbREr9V2ixi68lDdekg==',
                  },
                  cardContentUrlList: [
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson01-begin_1.html',
                  ],
                  flipButtonText: ['ヒントを見る', '次のヒント'],
                  sizeAndPosition: {
                    height: '40%',
                    width: '41%',
                    top: '0%',
                    left: '59%',
                  },
                  guideButtons: {
                    hintTalk: {
                      src: [
                        {
                          en: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/g_mickey_1_hint_002.mp3',
                          es: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/es/g_mickey_1_hint_002.mp3',
                        },
                      ],
                      className: 'hint-talk',
                      icon: 'volume-up',
                    },
                  },
                },
              ],
              enterBehaviourList: [],
              exitCondition: {
                type: 'AND',
                detailList: ['AnimationFinish:mimil'],
              },
              exitBehaviourList: [],
              metaData: {
                stepId: 20,
                stepType: {
                  type: 'talk',
                  snapType: 'begin',
                  layout: 'ERH1',
                  onlyMove: true,
                },
                preloadUrlList: [],
                customUpdateRuleList: [],
                uniqueId:
                  'F260cC0YTYx78h2oOwsUuNEIaq6FIj9iVYsjnQhTl0QAesxzx5JS9jiFFshLsezAsp7xbREr9V2ixi68lDdekg==',
              },
            },
            {
              stepId: 21,
              bgm: {
                src: '/api/shared/mp3/BGM00_gemlesson.mp3',
              },
              defaultNextStepId: 22,
              elementList: [
                {
                  elementName: 'FlashElement',
                  domId: 'mimil',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'F260cC0YTYx78h2oOwsUuNEIaq6FIj9iVYsjnQhTl0QAesxzx5JS9jiFFshLsezAsp7xbREr9V2ixi68lDdekg==',
                  },
                  flashName: 'mimil',
                  sizeAndPosition: {
                    left: '80%',
                    top: '15%',
                    width: null,
                    height: null,
                  },
                  isImage: false,
                  isDraggable: true,
                  playSerifTalk: {
                    src: {
                      en: '/api/shared/mp3/talk/mickey/g_mickey_1/g_mickey_1_010.mp3',
                      es: '/api/shared/mp3/talk/mickey/g_mickey_1/es/g_mickey_1_010.mp3',
                    },
                  },
                  talkId: 'default',
                  talkDetail: {
                    textList: [
                      'The code to make a circle is called <strong>ellipse</strong>. You can take your time to write out the code while looking at the hint.',
                    ],
                    arrowDirection: 'right',
                  },
                },
                {
                  elementName: 'DevelopWindowsElement',
                  domId: 'lesson-develop-windows',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'F260cC0YTYx78h2oOwsUuNEIaq6FIj9iVYsjnQhTl0QAesxzx5JS9jiFFshLsezAsp7xbREr9V2ixi68lDdekg==',
                  },
                  editorWindowsList: [
                    [
                      {
                        windowId: 'Editor1',
                        sizeAndPosition: {
                          height: '58.5%',
                          width: '41%',
                          top: '41.5%',
                          left: '59%',
                        },
                        theme: 'chaos',
                        highlightCssClass: 'flash-dark',
                        onFocusCssClass: 'normal-highlight',
                        editAreaList: [],
                        mode: 'javascript',
                        file: 'top_editor.js',
                        tabName: 'JavaScript',
                        editorWindowId: 'Editor',
                        tabSelected: true,
                      },
                    ],
                  ],
                  previewWindowList: [
                    {
                      windowId: 'preview',
                      sizeAndPosition: {
                        top: '0%',
                        left: '0%',
                        width: '58%',
                        height: '100%',
                      },
                      file: 'lesson01-begin.html',
                    },
                  ],
                  snap: 'lesson01-begin',
                },
                {
                  elementName: 'FlipCardElement',
                  domId: 'lesson-hint',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'F260cC0YTYx78h2oOwsUuNEIaq6FIj9iVYsjnQhTl0QAesxzx5JS9jiFFshLsezAsp7xbREr9V2ixi68lDdekg==',
                  },
                  cardContentUrlList: [
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson01-begin_1.html',
                  ],
                  flipButtonText: ['ヒントを見る', '次のヒント'],
                  sizeAndPosition: {
                    height: '40%',
                    width: '41%',
                    top: '0%',
                    left: '59%',
                  },
                  guideButtons: {
                    hintTalk: {
                      src: [
                        {
                          en: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/g_mickey_1_hint_002.mp3',
                          es: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/es/g_mickey_1_hint_002.mp3',
                        },
                      ],
                      className: 'hint-talk',
                      icon: 'volume-up',
                    },
                  },
                },
              ],
              enterBehaviourList: [],
              exitCondition: {
                type: 'AND',
                detailList: ['TalkFinish:mimil:default'],
              },
              exitBehaviourList: [],
              metaData: {
                stepId: 21,
                stepType: {
                  type: 'talk',
                  snapType: 'begin',
                  layout: 'ERH1',
                  onlyMove: false,
                  talkId: 'default',
                  domId: 'mimil',
                },
                preloadUrlList: [
                  '/api/shared/mp3/talk/mickey/g_mickey_1/g_mickey_1_010.mp3',
                  '/api/shared/mp3/talk/mickey/g_mickey_1/es/g_mickey_1_010.mp3',
                ],
                customUpdateRuleList: [],
                uniqueId:
                  'F260cC0YTYx78h2oOwsUuNEIaq6FIj9iVYsjnQhTl0QAesxzx5JS9jiFFshLsezAsp7xbREr9V2ixi68lDdekg==',
              },
            },
            {
              stepId: 22,
              bgm: {
                src: '/api/shared/mp3/BGM00_gemlesson.mp3',
              },
              defaultNextStepId: 23,
              elementList: [
                {
                  elementName: 'FlashElement',
                  domId: 'mimil',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      '19eDjJfCXt95SNNzhnAtT3R8KRMcoWSTh51JkN1glC3H3v2NxuZ6/2fPrJhmlbJQ1pLUuWVhtOWuLoGoaKe1zQ==',
                  },
                  flashName: 'mimil',
                  sizeAndPosition: {
                    left: '80%',
                    top: '15%',
                    width: null,
                    height: null,
                  },
                  isImage: false,
                  isDraggable: true,
                },
                {
                  elementName: 'DevelopWindowsElement',
                  domId: 'lesson-develop-windows',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      '19eDjJfCXt95SNNzhnAtT3R8KRMcoWSTh51JkN1glC3H3v2NxuZ6/2fPrJhmlbJQ1pLUuWVhtOWuLoGoaKe1zQ==',
                  },
                  editorWindowsList: [
                    [
                      {
                        windowId: 'Editor1',
                        sizeAndPosition: {
                          height: '58.5%',
                          width: '41%',
                          top: '41.5%',
                          left: '59%',
                        },
                        theme: 'chaos',
                        highlightCssClass: 'flash-dark',
                        onFocusCssClass: 'normal-highlight',
                        editAreaList: [
                          {
                            startRow: 0,
                            endRow: 0,
                          },
                        ],
                        mode: 'javascript',
                        file: 'top_editor.js',
                        tabName: 'JavaScript',
                        editorWindowId: 'Editor',
                        restrictCursorRow: true,
                        tabSelected: true,
                      },
                    ],
                  ],
                  previewWindowList: [
                    {
                      windowId: 'preview',
                      sizeAndPosition: {
                        top: '0%',
                        left: '0%',
                        width: '58%',
                        height: '100%',
                      },
                      file: 'lesson01-main.html',
                    },
                  ],
                  snap: 'lesson01-main',
                  validationFile: 'top_test.js',
                },
                {
                  elementName: 'FlipCardElement',
                  domId: 'lesson-hint',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      '19eDjJfCXt95SNNzhnAtT3R8KRMcoWSTh51JkN1glC3H3v2NxuZ6/2fPrJhmlbJQ1pLUuWVhtOWuLoGoaKe1zQ==',
                  },
                  cardContentUrlList: [
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson01-main_1.html',
                  ],
                  flipButtonText: ['ヒントを見る', '次のヒント'],
                  sizeAndPosition: {
                    height: '40%',
                    width: '41%',
                    top: '0%',
                    left: '59%',
                  },
                  guideButtons: {
                    hintTalk: {
                      src: [
                        {
                          en: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/g_mickey_1_hint_003.mp3',
                          es: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/es/g_mickey_1_hint_003.mp3',
                        },
                      ],
                      className: 'hint-talk',
                      icon: 'volume-up',
                    },
                  },
                },
              ],
              enterBehaviourList: [],
              exitCondition: {
                type: 'AND',
                detailList: ['ValidationFinish:lesson-develop-windows:success'],
              },
              exitBehaviourList: [],
              metaData: {
                stepId: 22,
                stepType: {
                  type: 'lesson',
                  snapType: '',
                  layout: 'ERH1',
                },
                preloadUrlList: [
                  '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/g_mickey_1_hint_003.mp3',
                  '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/es/g_mickey_1_hint_003.mp3',
                  '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson01-main_1.html',
                ],
                customUpdateRuleList: [],
                uniqueId:
                  '19eDjJfCXt95SNNzhnAtT3R8KRMcoWSTh51JkN1glC3H3v2NxuZ6/2fPrJhmlbJQ1pLUuWVhtOWuLoGoaKe1zQ==',
              },
            },
            {
              stepId: 23,
              bgm: {
                src: '/api/shared/mp3/BGM00_gemlesson.mp3',
              },
              defaultNextStepId: 24,
              elementList: [
                {
                  elementName: 'FlashElement',
                  domId: 'mimil',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'hjhIM6vHNPd1hVA7RaBlWr/y9wUjoU91Nd7SBh2UGD3f8lWJCLptifOcgPqVSfUPEHjkhQ4DxlGmxvK6UK094g==',
                  },
                  flashName: 'mimil',
                  sizeAndPosition: {
                    left: '20%',
                    top: '25%',
                    width: null,
                    height: null,
                  },
                  isImage: false,
                  isDraggable: true,
                },
                {
                  elementName: 'DevelopWindowsElement',
                  domId: 'lesson-develop-windows',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'hjhIM6vHNPd1hVA7RaBlWr/y9wUjoU91Nd7SBh2UGD3f8lWJCLptifOcgPqVSfUPEHjkhQ4DxlGmxvK6UK094g==',
                  },
                  editorWindowsList: [
                    [
                      {
                        windowId: 'Editor1',
                        sizeAndPosition: {
                          height: '58.5%',
                          width: '41%',
                          top: '41.5%',
                          left: '59%',
                        },
                        theme: 'chaos',
                        highlightCssClass: 'flash-dark',
                        onFocusCssClass: 'normal-highlight',
                        editAreaList: [
                          {
                            startRow: 0,
                            endRow: 0,
                          },
                        ],
                        mode: 'javascript',
                        file: 'top_editor.js',
                        tabName: 'JavaScript',
                        editorWindowId: 'Editor',
                        restrictCursorRow: true,
                        tabSelected: true,
                      },
                    ],
                  ],
                  previewWindowList: [
                    {
                      windowId: 'preview',
                      sizeAndPosition: {
                        top: '0%',
                        left: '0%',
                        width: '58%',
                        height: '100%',
                      },
                      file: 'lesson01-main.html',
                    },
                  ],
                  snap: 'lesson01-main',
                  validationFile: 'top_test.js',
                },
                {
                  elementName: 'FlipCardElement',
                  domId: 'lesson-hint',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'hjhIM6vHNPd1hVA7RaBlWr/y9wUjoU91Nd7SBh2UGD3f8lWJCLptifOcgPqVSfUPEHjkhQ4DxlGmxvK6UK094g==',
                  },
                  cardContentUrlList: [
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson01-main_1.html',
                  ],
                  flipButtonText: ['ヒントを見る', '次のヒント'],
                  sizeAndPosition: {
                    height: '40%',
                    width: '41%',
                    top: '0%',
                    left: '59%',
                  },
                  guideButtons: {
                    hintTalk: {
                      src: [
                        {
                          en: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/g_mickey_1_hint_003.mp3',
                          es: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/es/g_mickey_1_hint_003.mp3',
                        },
                      ],
                      className: 'hint-talk',
                      icon: 'volume-up',
                    },
                  },
                },
              ],
              enterBehaviourList: [],
              exitCondition: {
                type: 'AND',
                detailList: ['AnimationFinish:mimil'],
              },
              exitBehaviourList: [],
              metaData: {
                stepId: 23,
                stepType: {
                  type: 'talk',
                  snapType: '',
                  layout: 'ERH1',
                  onlyMove: true,
                },
                preloadUrlList: [],
                customUpdateRuleList: [],
                uniqueId:
                  'hjhIM6vHNPd1hVA7RaBlWr/y9wUjoU91Nd7SBh2UGD3f8lWJCLptifOcgPqVSfUPEHjkhQ4DxlGmxvK6UK094g==',
              },
            },
            {
              stepId: 24,
              bgm: {
                src: '/api/shared/mp3/BGM00_gemlesson.mp3',
              },
              defaultNextStepId: 25,
              elementList: [
                {
                  elementName: 'FlashElement',
                  domId: 'mimil',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'hjhIM6vHNPd1hVA7RaBlWr/y9wUjoU91Nd7SBh2UGD3f8lWJCLptifOcgPqVSfUPEHjkhQ4DxlGmxvK6UK094g==',
                  },
                  flashName: 'mimil',
                  sizeAndPosition: {
                    left: '20%',
                    top: '25%',
                    width: null,
                    height: null,
                  },
                  isImage: false,
                  isDraggable: true,
                  playSerifTalk: {
                    src: {
                      en: '/api/shared/mp3/talk/mickey/g_mickey_1/g_mickey_1_011.mp3',
                      es: '/api/shared/mp3/talk/mickey/g_mickey_1/es/g_mickey_1_011.mp3',
                    },
                  },
                  talkId: 'default',
                  talkDetail: {
                    textList: ['Wow! A yellow circle appeared!'],
                    arrowDirection: 'left',
                  },
                },
                {
                  elementName: 'DevelopWindowsElement',
                  domId: 'lesson-develop-windows',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'hjhIM6vHNPd1hVA7RaBlWr/y9wUjoU91Nd7SBh2UGD3f8lWJCLptifOcgPqVSfUPEHjkhQ4DxlGmxvK6UK094g==',
                  },
                  editorWindowsList: [
                    [
                      {
                        windowId: 'Editor1',
                        sizeAndPosition: {
                          height: '58.5%',
                          width: '41%',
                          top: '41.5%',
                          left: '59%',
                        },
                        theme: 'chaos',
                        highlightCssClass: 'flash-dark',
                        onFocusCssClass: 'normal-highlight',
                        editAreaList: [
                          {
                            startRow: 0,
                            endRow: 0,
                          },
                        ],
                        mode: 'javascript',
                        file: 'top_editor.js',
                        tabName: 'JavaScript',
                        editorWindowId: 'Editor',
                        restrictCursorRow: true,
                        tabSelected: true,
                      },
                    ],
                  ],
                  previewWindowList: [
                    {
                      windowId: 'preview',
                      sizeAndPosition: {
                        top: '0%',
                        left: '0%',
                        width: '58%',
                        height: '100%',
                      },
                      file: 'lesson01-main.html',
                    },
                  ],
                  snap: 'lesson01-main',
                  validationFile: 'top_test.js',
                },
                {
                  elementName: 'FlipCardElement',
                  domId: 'lesson-hint',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'hjhIM6vHNPd1hVA7RaBlWr/y9wUjoU91Nd7SBh2UGD3f8lWJCLptifOcgPqVSfUPEHjkhQ4DxlGmxvK6UK094g==',
                  },
                  cardContentUrlList: [
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson01-main_1.html',
                  ],
                  flipButtonText: ['ヒントを見る', '次のヒント'],
                  sizeAndPosition: {
                    height: '40%',
                    width: '41%',
                    top: '0%',
                    left: '59%',
                  },
                  guideButtons: {
                    hintTalk: {
                      src: [
                        {
                          en: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/g_mickey_1_hint_003.mp3',
                          es: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/es/g_mickey_1_hint_003.mp3',
                        },
                      ],
                      className: 'hint-talk',
                      icon: 'volume-up',
                    },
                  },
                },
              ],
              enterBehaviourList: [],
              exitCondition: {
                type: 'AND',
                detailList: ['TalkFinish:mimil:default'],
              },
              exitBehaviourList: [],
              metaData: {
                stepId: 24,
                stepType: {
                  type: 'talk',
                  snapType: '',
                  layout: 'ERH1',
                  onlyMove: false,
                  talkId: 'default',
                  domId: 'mimil',
                },
                preloadUrlList: [
                  '/api/shared/mp3/talk/mickey/g_mickey_1/g_mickey_1_011.mp3',
                  '/api/shared/mp3/talk/mickey/g_mickey_1/es/g_mickey_1_011.mp3',
                ],
                customUpdateRuleList: [],
                uniqueId:
                  'hjhIM6vHNPd1hVA7RaBlWr/y9wUjoU91Nd7SBh2UGD3f8lWJCLptifOcgPqVSfUPEHjkhQ4DxlGmxvK6UK094g==',
              },
            },
            {
              stepId: 25,
              bgm: {
                src: '/api/shared/mp3/BGM00_gemlesson.mp3',
              },
              defaultNextStepId: 26,
              elementList: [
                {
                  elementName: 'FlashElement',
                  domId: 'mimil',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'BUgqwOVsmECfdgCGaIb3RalqhAqlQ9iZkxNEAmLK1otKxPF4On9no0huDVUfqi1+ty5cM5T1onhIhrOdkc9y2Q==',
                  },
                  flashName: 'mimil',
                  sizeAndPosition: {
                    left: '85%',
                    top: '50%',
                    width: null,
                    height: null,
                  },
                  isImage: false,
                  isDraggable: true,
                },
                {
                  elementName: 'DevelopWindowsElement',
                  domId: 'lesson-develop-windows',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'BUgqwOVsmECfdgCGaIb3RalqhAqlQ9iZkxNEAmLK1otKxPF4On9no0huDVUfqi1+ty5cM5T1onhIhrOdkc9y2Q==',
                  },
                  editorWindowsList: [
                    [
                      {
                        windowId: 'Editor1',
                        sizeAndPosition: {
                          height: '58.5%',
                          width: '41%',
                          top: '41.5%',
                          left: '59%',
                        },
                        theme: 'chaos',
                        highlightCssClass: 'flash-dark',
                        onFocusCssClass: 'normal-highlight',
                        editAreaList: [
                          {
                            startRow: 0,
                            endRow: 0,
                          },
                        ],
                        mode: 'javascript',
                        file: 'top_editor.js',
                        tabName: 'JavaScript',
                        editorWindowId: 'Editor',
                        restrictCursorRow: true,
                        tabSelected: true,
                      },
                    ],
                  ],
                  previewWindowList: [
                    {
                      windowId: 'preview',
                      sizeAndPosition: {
                        top: '0%',
                        left: '0%',
                        width: '58%',
                        height: '100%',
                      },
                      file: 'lesson01-main.html',
                    },
                  ],
                  snap: 'lesson01-main',
                  validationFile: 'top_test.js',
                },
                {
                  elementName: 'FlipCardElement',
                  domId: 'lesson-hint',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'BUgqwOVsmECfdgCGaIb3RalqhAqlQ9iZkxNEAmLK1otKxPF4On9no0huDVUfqi1+ty5cM5T1onhIhrOdkc9y2Q==',
                  },
                  cardContentUrlList: [
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson01-main_1.html',
                  ],
                  flipButtonText: ['ヒントを見る', '次のヒント'],
                  sizeAndPosition: {
                    height: '40%',
                    width: '41%',
                    top: '0%',
                    left: '59%',
                  },
                  guideButtons: {
                    hintTalk: {
                      src: [
                        {
                          en: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/g_mickey_1_hint_003.mp3',
                          es: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/es/g_mickey_1_hint_003.mp3',
                        },
                      ],
                      className: 'hint-talk',
                      icon: 'volume-up',
                    },
                  },
                },
              ],
              enterBehaviourList: [],
              exitCondition: {
                type: 'AND',
                detailList: ['AnimationFinish:mimil'],
              },
              exitBehaviourList: [],
              metaData: {
                stepId: 25,
                stepType: {
                  type: 'talk',
                  snapType: '',
                  layout: 'ERH1',
                  onlyMove: true,
                },
                preloadUrlList: [],
                customUpdateRuleList: [],
                uniqueId:
                  'BUgqwOVsmECfdgCGaIb3RalqhAqlQ9iZkxNEAmLK1otKxPF4On9no0huDVUfqi1+ty5cM5T1onhIhrOdkc9y2Q==',
              },
            },
            {
              stepId: 26,
              bgm: {
                src: '/api/shared/mp3/BGM00_gemlesson.mp3',
              },
              defaultNextStepId: 27,
              elementList: [
                {
                  elementName: 'FlashElement',
                  domId: 'mimil',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'BUgqwOVsmECfdgCGaIb3RalqhAqlQ9iZkxNEAmLK1otKxPF4On9no0huDVUfqi1+ty5cM5T1onhIhrOdkc9y2Q==',
                  },
                  flashName: 'mimil',
                  sizeAndPosition: {
                    left: '85%',
                    top: '50%',
                    width: null,
                    height: null,
                  },
                  isImage: false,
                  isDraggable: true,
                  playSerifTalk: {
                    src: {
                      en: '/api/shared/mp3/talk/mickey/g_mickey_1/g_mickey_1_012.mp3',
                      es: '/api/shared/mp3/talk/mickey/g_mickey_1/es/g_mickey_1_012.mp3',
                    },
                  },
                  talkId: 'default',
                  talkDetail: {
                    textList: [
                      'Let&#39;s change the numbers after ellipse. Start with the first one.',
                    ],
                    arrowDirection: 'right',
                  },
                },
                {
                  elementName: 'DevelopWindowsElement',
                  domId: 'lesson-develop-windows',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'BUgqwOVsmECfdgCGaIb3RalqhAqlQ9iZkxNEAmLK1otKxPF4On9no0huDVUfqi1+ty5cM5T1onhIhrOdkc9y2Q==',
                  },
                  editorWindowsList: [
                    [
                      {
                        windowId: 'Editor1',
                        sizeAndPosition: {
                          height: '58.5%',
                          width: '41%',
                          top: '41.5%',
                          left: '59%',
                        },
                        theme: 'chaos',
                        highlightCssClass: 'flash-dark',
                        onFocusCssClass: 'normal-highlight',
                        editAreaList: [
                          {
                            startRow: 0,
                            endRow: 0,
                          },
                        ],
                        mode: 'javascript',
                        file: 'top_editor.js',
                        tabName: 'JavaScript',
                        editorWindowId: 'Editor',
                        restrictCursorRow: true,
                        tabSelected: true,
                      },
                    ],
                  ],
                  previewWindowList: [
                    {
                      windowId: 'preview',
                      sizeAndPosition: {
                        top: '0%',
                        left: '0%',
                        width: '58%',
                        height: '100%',
                      },
                      file: 'lesson01-main.html',
                    },
                  ],
                  snap: 'lesson01-main',
                  validationFile: 'top_test.js',
                },
                {
                  elementName: 'FlipCardElement',
                  domId: 'lesson-hint',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'BUgqwOVsmECfdgCGaIb3RalqhAqlQ9iZkxNEAmLK1otKxPF4On9no0huDVUfqi1+ty5cM5T1onhIhrOdkc9y2Q==',
                  },
                  cardContentUrlList: [
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson01-main_1.html',
                  ],
                  flipButtonText: ['ヒントを見る', '次のヒント'],
                  sizeAndPosition: {
                    height: '40%',
                    width: '41%',
                    top: '0%',
                    left: '59%',
                  },
                  guideButtons: {
                    hintTalk: {
                      src: [
                        {
                          en: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/g_mickey_1_hint_003.mp3',
                          es: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/es/g_mickey_1_hint_003.mp3',
                        },
                      ],
                      className: 'hint-talk',
                      icon: 'volume-up',
                    },
                  },
                },
              ],
              enterBehaviourList: [],
              exitCondition: {
                type: 'AND',
                detailList: ['TalkFinish:mimil:default'],
              },
              exitBehaviourList: [],
              metaData: {
                stepId: 26,
                stepType: {
                  type: 'talk',
                  snapType: '',
                  layout: 'ERH1',
                  onlyMove: false,
                  talkId: 'default',
                  domId: 'mimil',
                },
                preloadUrlList: [
                  '/api/shared/mp3/talk/mickey/g_mickey_1/g_mickey_1_012.mp3',
                  '/api/shared/mp3/talk/mickey/g_mickey_1/es/g_mickey_1_012.mp3',
                ],
                customUpdateRuleList: [],
                uniqueId:
                  'BUgqwOVsmECfdgCGaIb3RalqhAqlQ9iZkxNEAmLK1otKxPF4On9no0huDVUfqi1+ty5cM5T1onhIhrOdkc9y2Q==',
              },
            },
            {
              stepId: 27,
              bgm: {
                src: '/api/shared/mp3/BGM00_gemlesson.mp3',
              },
              defaultNextStepId: 28,
              elementList: [
                {
                  elementName: 'FlashElement',
                  domId: 'mimil',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'qOw2itRHesdn6FzBZzUTgcugpcVx/iT7iQKPTlfAVmCpQNQ53priGvYPI7kCo+NMzE/6l4MQWEa2yhdw198K+Q==',
                  },
                  flashName: 'mimil',
                  sizeAndPosition: {
                    left: '85%',
                    top: '15%',
                    width: null,
                    height: null,
                  },
                  isImage: false,
                  isDraggable: true,
                  playSerifTalk: {
                    src: {
                      en: '/api/shared/mp3/talk/mickey/g_mickey_1/g_mickey_1_013.mp3',
                      es: '/api/shared/mp3/talk/mickey/g_mickey_1/es/g_mickey_1_013.mp3',
                    },
                  },
                },
                {
                  elementName: 'DevelopWindowsElement',
                  domId: 'lesson-develop-windows',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'qOw2itRHesdn6FzBZzUTgcugpcVx/iT7iQKPTlfAVmCpQNQ53priGvYPI7kCo+NMzE/6l4MQWEa2yhdw198K+Q==',
                  },
                  editorWindowsList: [
                    [
                      {
                        windowId: 'Editor1',
                        sizeAndPosition: {
                          height: '58.5%',
                          width: '41%',
                          top: '41.5%',
                          left: '59%',
                        },
                        theme: 'chaos',
                        highlightCssClass: 'flash-dark',
                        onFocusCssClass: 'normal-highlight',
                        editAreaList: [
                          {
                            startRow: 0,
                            endRow: 0,
                          },
                        ],
                        mode: 'javascript',
                        file: 'top_editor.js',
                        tabName: 'JavaScript',
                        editorWindowId: 'Editor',
                        restrictCursorRow: true,
                        tabSelected: true,
                      },
                    ],
                  ],
                  previewWindowList: [
                    {
                      windowId: 'preview',
                      sizeAndPosition: {
                        top: '0%',
                        left: '0%',
                        width: '58%',
                        height: '100%',
                      },
                      file: 'lesson01-main.html',
                    },
                  ],
                  snap: 'lesson01-main',
                  validationFile: 'top_test.js',
                },
                {
                  elementName: 'FlipCardElement',
                  domId: 'lesson-hint',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'qOw2itRHesdn6FzBZzUTgcugpcVx/iT7iQKPTlfAVmCpQNQ53priGvYPI7kCo+NMzE/6l4MQWEa2yhdw198K+Q==',
                  },
                  cardContentUrlList: [
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson01-main_1.html',
                  ],
                  flipButtonText: ['ヒントを見る', '次のヒント'],
                  sizeAndPosition: {
                    height: '40%',
                    width: '41%',
                    top: '0%',
                    left: '59%',
                  },
                  guideButtons: {
                    hintTalk: {
                      src: [
                        {
                          en: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/g_mickey_1_hint_003.mp3',
                          es: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/es/g_mickey_1_hint_003.mp3',
                        },
                      ],
                      className: 'hint-talk',
                      icon: 'volume-up',
                    },
                  },
                },
              ],
              enterBehaviourList: [],
              exitCondition: {
                type: 'AND',
                detailList: ['AnimationFinish:mimil'],
              },
              exitBehaviourList: [],
              metaData: {
                stepId: 27,
                stepType: {
                  type: 'talk',
                  snapType: '',
                  layout: 'ERH1',
                  onlyMove: true,
                },
                preloadUrlList: [
                  '/api/shared/mp3/talk/mickey/g_mickey_1/g_mickey_1_013.mp3',
                  '/api/shared/mp3/talk/mickey/g_mickey_1/es/g_mickey_1_013.mp3',
                ],
                customUpdateRuleList: [],
                uniqueId:
                  'qOw2itRHesdn6FzBZzUTgcugpcVx/iT7iQKPTlfAVmCpQNQ53priGvYPI7kCo+NMzE/6l4MQWEa2yhdw198K+Q==',
              },
            },
            {
              stepId: 28,
              bgm: {
                src: '/api/shared/mp3/BGM00_gemlesson.mp3',
              },
              defaultNextStepId: 29,
              elementList: [
                {
                  elementName: 'FlashElement',
                  domId: 'mimil',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      '8+3dSFduwcWkQvQxkXqgkHfAxBdXj4OnzN07zhZ56p9zbSpS5YZrDqjIBCry0YArmxIV72bkH215IBFjd91EJw==',
                  },
                  flashName: 'mimil',
                  sizeAndPosition: {
                    left: '85%',
                    top: '15%',
                    width: null,
                    height: null,
                  },
                  isImage: false,
                  isDraggable: true,
                },
                {
                  elementName: 'DevelopWindowsElement',
                  domId: 'lesson-develop-windows',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      '8+3dSFduwcWkQvQxkXqgkHfAxBdXj4OnzN07zhZ56p9zbSpS5YZrDqjIBCry0YArmxIV72bkH215IBFjd91EJw==',
                  },
                  editorWindowsList: [
                    [
                      {
                        windowId: 'Editor1',
                        sizeAndPosition: {
                          height: '58.5%',
                          width: '41%',
                          top: '41.5%',
                          left: '59%',
                        },
                        theme: 'chaos',
                        highlightCssClass: 'flash-dark',
                        onFocusCssClass: 'normal-highlight',
                        editAreaList: [
                          {
                            startRow: 0,
                            endRow: 0,
                          },
                        ],
                        mode: 'javascript',
                        file: 'top_editor.js',
                        tabName: 'JavaScript',
                        editorWindowId: 'Editor',
                        restrictCursorRow: true,
                        tabSelected: true,
                      },
                    ],
                  ],
                  previewWindowList: [
                    {
                      windowId: 'preview',
                      sizeAndPosition: {
                        top: '0%',
                        left: '0%',
                        width: '58%',
                        height: '100%',
                      },
                      file: 'lesson02-main.html',
                    },
                  ],
                  snap: 'lesson02-main',
                  validationFile: 'top_test.js',
                },
                {
                  elementName: 'FlipCardElement',
                  domId: 'lesson-hint',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      '8+3dSFduwcWkQvQxkXqgkHfAxBdXj4OnzN07zhZ56p9zbSpS5YZrDqjIBCry0YArmxIV72bkH215IBFjd91EJw==',
                  },
                  cardContentUrlList: [
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson02-main_1.html',
                  ],
                  flipButtonText: ['ヒントを見る', '次のヒント'],
                  sizeAndPosition: {
                    height: '40%',
                    width: '41%',
                    top: '0%',
                    left: '59%',
                  },
                  guideButtons: {
                    hintTalk: {
                      src: [
                        {
                          en: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/g_mickey_1_hint_004.mp3',
                          es: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/es/g_mickey_1_hint_004.mp3',
                        },
                      ],
                      className: 'hint-talk',
                      icon: 'volume-up',
                    },
                  },
                },
              ],
              enterBehaviourList: [],
              exitCondition: {
                type: 'AND',
                detailList: ['ValidationFinish:lesson-develop-windows:success'],
              },
              exitBehaviourList: [],
              metaData: {
                stepId: 28,
                stepType: {
                  type: 'lesson',
                  snapType: '',
                  layout: 'ERH1',
                },
                preloadUrlList: [
                  '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/g_mickey_1_hint_004.mp3',
                  '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/es/g_mickey_1_hint_004.mp3',
                  '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson02-main_1.html',
                ],
                customUpdateRuleList: [],
                stepLabel: '',
                lessonName: 'Change the numbers within ellipse (1)',
                isLesson: true,
                uniqueId:
                  '8+3dSFduwcWkQvQxkXqgkHfAxBdXj4OnzN07zhZ56p9zbSpS5YZrDqjIBCry0YArmxIV72bkH215IBFjd91EJw==',
              },
            },
            {
              stepId: 29,
              bgm: {
                src: '/api/shared/mp3/BGM00_gemlesson.mp3',
              },
              defaultNextStepId: 30,
              elementList: [
                {
                  elementName: 'FlashElement',
                  domId: 'mimil',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'IHVUxXDqpH7YHJEJ4yu+0rjZv245CQ97cuEVzKjsIIQTkkmd7W5iZpoGUCJ+l2WUw5yB6xWcBi0a6PK1yNqVmQ==',
                  },
                  flashName: 'mimil',
                  sizeAndPosition: {
                    left: '85%',
                    top: '15%',
                    width: null,
                    height: null,
                  },
                  isImage: false,
                  isDraggable: true,
                },
                {
                  elementName: 'DevelopWindowsElement',
                  domId: 'lesson-develop-windows',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'IHVUxXDqpH7YHJEJ4yu+0rjZv245CQ97cuEVzKjsIIQTkkmd7W5iZpoGUCJ+l2WUw5yB6xWcBi0a6PK1yNqVmQ==',
                  },
                  editorWindowsList: [
                    [
                      {
                        windowId: 'Editor1',
                        sizeAndPosition: {
                          height: '58.5%',
                          width: '41%',
                          top: '41.5%',
                          left: '59%',
                        },
                        theme: 'chaos',
                        highlightCssClass: 'flash-dark',
                        onFocusCssClass: 'normal-highlight',
                        editAreaList: [
                          {
                            startRow: 0,
                            endRow: 0,
                          },
                        ],
                        mode: 'javascript',
                        file: 'top_editor.js',
                        tabName: 'JavaScript',
                        editorWindowId: 'Editor',
                        restrictCursorRow: true,
                        tabSelected: true,
                      },
                    ],
                  ],
                  previewWindowList: [
                    {
                      windowId: 'preview',
                      sizeAndPosition: {
                        top: '0%',
                        left: '0%',
                        width: '58%',
                        height: '100%',
                      },
                      file: 'lesson02-main.html',
                    },
                  ],
                  snap: 'lesson02-main',
                  validationFile: 'top_test.js',
                },
                {
                  elementName: 'FlipCardElement',
                  domId: 'lesson-hint',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'IHVUxXDqpH7YHJEJ4yu+0rjZv245CQ97cuEVzKjsIIQTkkmd7W5iZpoGUCJ+l2WUw5yB6xWcBi0a6PK1yNqVmQ==',
                  },
                  cardContentUrlList: [
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson02-main_1.html',
                  ],
                  flipButtonText: ['ヒントを見る', '次のヒント'],
                  sizeAndPosition: {
                    height: '40%',
                    width: '41%',
                    top: '0%',
                    left: '59%',
                  },
                  guideButtons: {
                    hintTalk: {
                      src: [
                        {
                          en: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/g_mickey_1_hint_004.mp3',
                          es: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/es/g_mickey_1_hint_004.mp3',
                        },
                      ],
                      className: 'hint-talk',
                      icon: 'volume-up',
                    },
                  },
                },
              ],
              enterBehaviourList: [],
              exitCondition: {},
              exitBehaviourList: [],
              metaData: {
                stepId: 29,
                stepType: {
                  type: 'talk',
                  snapType: '',
                  layout: 'ERH1',
                  onlyMove: true,
                },
                preloadUrlList: [],
                customUpdateRuleList: [],
                uniqueId:
                  'IHVUxXDqpH7YHJEJ4yu+0rjZv245CQ97cuEVzKjsIIQTkkmd7W5iZpoGUCJ+l2WUw5yB6xWcBi0a6PK1yNqVmQ==',
              },
            },
            {
              stepId: 30,
              bgm: {
                src: '/api/shared/mp3/BGM00_gemlesson.mp3',
              },
              defaultNextStepId: 31,
              elementList: [
                {
                  elementName: 'FlashElement',
                  domId: 'mimil',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'IHVUxXDqpH7YHJEJ4yu+0rjZv245CQ97cuEVzKjsIIQTkkmd7W5iZpoGUCJ+l2WUw5yB6xWcBi0a6PK1yNqVmQ==',
                  },
                  flashName: 'mimil',
                  sizeAndPosition: {
                    left: '85%',
                    top: '15%',
                    width: null,
                    height: null,
                  },
                  isImage: false,
                  isDraggable: true,
                  playSerifTalk: {
                    src: {
                      en: '/api/shared/mp3/talk/mickey/g_mickey_1/g_mickey_1_013.mp3',
                      es: '/api/shared/mp3/talk/mickey/g_mickey_1/es/g_mickey_1_013.mp3',
                    },
                  },
                  talkId: 'default',
                  talkDetail: {
                    textList: [
                      'Great! The circle moved to the right. The first number decides how far the circle is from the left of the screen.',
                    ],
                    arrowDirection: 'right',
                  },
                },
                {
                  elementName: 'DevelopWindowsElement',
                  domId: 'lesson-develop-windows',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'IHVUxXDqpH7YHJEJ4yu+0rjZv245CQ97cuEVzKjsIIQTkkmd7W5iZpoGUCJ+l2WUw5yB6xWcBi0a6PK1yNqVmQ==',
                  },
                  editorWindowsList: [
                    [
                      {
                        windowId: 'Editor1',
                        sizeAndPosition: {
                          height: '58.5%',
                          width: '41%',
                          top: '41.5%',
                          left: '59%',
                        },
                        theme: 'chaos',
                        highlightCssClass: 'flash-dark',
                        onFocusCssClass: 'normal-highlight',
                        editAreaList: [
                          {
                            startRow: 0,
                            endRow: 0,
                          },
                        ],
                        mode: 'javascript',
                        file: 'top_editor.js',
                        tabName: 'JavaScript',
                        editorWindowId: 'Editor',
                        restrictCursorRow: true,
                        tabSelected: true,
                      },
                    ],
                  ],
                  previewWindowList: [
                    {
                      windowId: 'preview',
                      sizeAndPosition: {
                        top: '0%',
                        left: '0%',
                        width: '58%',
                        height: '100%',
                      },
                      file: 'lesson02-main.html',
                    },
                  ],
                  snap: 'lesson02-main',
                  validationFile: 'top_test.js',
                },
                {
                  elementName: 'FlipCardElement',
                  domId: 'lesson-hint',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'IHVUxXDqpH7YHJEJ4yu+0rjZv245CQ97cuEVzKjsIIQTkkmd7W5iZpoGUCJ+l2WUw5yB6xWcBi0a6PK1yNqVmQ==',
                  },
                  cardContentUrlList: [
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson02-main_1.html',
                  ],
                  flipButtonText: ['ヒントを見る', '次のヒント'],
                  sizeAndPosition: {
                    height: '40%',
                    width: '41%',
                    top: '0%',
                    left: '59%',
                  },
                  guideButtons: {
                    hintTalk: {
                      src: [
                        {
                          en: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/g_mickey_1_hint_004.mp3',
                          es: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/es/g_mickey_1_hint_004.mp3',
                        },
                      ],
                      className: 'hint-talk',
                      icon: 'volume-up',
                    },
                  },
                },
              ],
              enterBehaviourList: [],
              exitCondition: {
                type: 'AND',
                detailList: ['TalkFinish:mimil:default'],
              },
              exitBehaviourList: [],
              metaData: {
                stepId: 30,
                stepType: {
                  type: 'talk',
                  snapType: '',
                  layout: 'ERH1',
                  onlyMove: false,
                  talkId: 'default',
                  domId: 'mimil',
                },
                preloadUrlList: [
                  '/api/shared/mp3/talk/mickey/g_mickey_1/g_mickey_1_013.mp3',
                  '/api/shared/mp3/talk/mickey/g_mickey_1/es/g_mickey_1_013.mp3',
                ],
                customUpdateRuleList: [],
                uniqueId:
                  'IHVUxXDqpH7YHJEJ4yu+0rjZv245CQ97cuEVzKjsIIQTkkmd7W5iZpoGUCJ+l2WUw5yB6xWcBi0a6PK1yNqVmQ==',
              },
            },
            {
              stepId: 31,
              bgm: {
                src: '/api/shared/mp3/BGM00_gemlesson.mp3',
              },
              defaultNextStepId: 32,
              elementList: [
                {
                  elementName: 'FlashElement',
                  domId: 'mimil',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'AWh3LE87WzNkW8rFkeu1yNAno8sqhL+VdoEXN940GY2wXFxpec+jUHm3WEsTXQmPJp6W7JQrwaywDTrTFQcGAQ==',
                  },
                  flashName: 'mimil',
                  sizeAndPosition: {
                    left: '40%',
                    top: '45%',
                    width: null,
                    height: null,
                  },
                  isImage: false,
                  isDraggable: true,
                },
                {
                  elementName: 'DevelopWindowsElement',
                  domId: 'lesson-develop-windows',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'AWh3LE87WzNkW8rFkeu1yNAno8sqhL+VdoEXN940GY2wXFxpec+jUHm3WEsTXQmPJp6W7JQrwaywDTrTFQcGAQ==',
                  },
                  editorWindowsList: [
                    [
                      {
                        windowId: 'Editor1',
                        sizeAndPosition: {
                          height: '58.5%',
                          width: '41%',
                          top: '41.5%',
                          left: '59%',
                        },
                        theme: 'chaos',
                        highlightCssClass: 'flash-dark',
                        onFocusCssClass: 'normal-highlight',
                        editAreaList: [
                          {
                            startRow: 0,
                            endRow: 0,
                          },
                        ],
                        mode: 'javascript',
                        file: 'top_editor.js',
                        tabName: 'JavaScript',
                        editorWindowId: 'Editor',
                        restrictCursorRow: true,
                        tabSelected: true,
                      },
                    ],
                  ],
                  previewWindowList: [
                    {
                      windowId: 'preview',
                      sizeAndPosition: {
                        top: '0%',
                        left: '0%',
                        width: '58%',
                        height: '100%',
                      },
                      file: 'lesson02-main.html',
                    },
                  ],
                  snap: 'lesson02-main',
                  validationFile: 'top_test.js',
                },
                {
                  elementName: 'FlipCardElement',
                  domId: 'lesson-hint',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'AWh3LE87WzNkW8rFkeu1yNAno8sqhL+VdoEXN940GY2wXFxpec+jUHm3WEsTXQmPJp6W7JQrwaywDTrTFQcGAQ==',
                  },
                  cardContentUrlList: [
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson02-main_1.html',
                  ],
                  flipButtonText: ['ヒントを見る', '次のヒント'],
                  sizeAndPosition: {
                    height: '40%',
                    width: '41%',
                    top: '0%',
                    left: '59%',
                  },
                  guideButtons: {
                    hintTalk: {
                      src: [
                        {
                          en: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/g_mickey_1_hint_004.mp3',
                          es: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/es/g_mickey_1_hint_004.mp3',
                        },
                      ],
                      className: 'hint-talk',
                      icon: 'volume-up',
                    },
                  },
                },
              ],
              enterBehaviourList: [],
              exitCondition: {
                type: 'AND',
                detailList: ['AnimationFinish:mimil'],
              },
              exitBehaviourList: [],
              metaData: {
                stepId: 31,
                stepType: {
                  type: 'talk',
                  snapType: '',
                  layout: 'ERH1',
                  onlyMove: true,
                },
                preloadUrlList: [],
                customUpdateRuleList: [],
                uniqueId:
                  'AWh3LE87WzNkW8rFkeu1yNAno8sqhL+VdoEXN940GY2wXFxpec+jUHm3WEsTXQmPJp6W7JQrwaywDTrTFQcGAQ==',
              },
            },
            {
              stepId: 32,
              bgm: {
                src: '/api/shared/mp3/BGM00_gemlesson.mp3',
              },
              defaultNextStepId: 33,
              elementList: [
                {
                  elementName: 'FlashElement',
                  domId: 'mimil',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'AWh3LE87WzNkW8rFkeu1yNAno8sqhL+VdoEXN940GY2wXFxpec+jUHm3WEsTXQmPJp6W7JQrwaywDTrTFQcGAQ==',
                  },
                  flashName: 'mimil',
                  sizeAndPosition: {
                    left: '40%',
                    top: '45%',
                    width: null,
                    height: null,
                  },
                  isImage: false,
                  isDraggable: true,
                  playSerifTalk: {
                    src: {
                      en: '/api/shared/mp3/talk/mickey/g_mickey_1/g_mickey_1_014.mp3',
                      es: '/api/shared/mp3/talk/mickey/g_mickey_1/es/g_mickey_1_014.mp3',
                    },
                  },
                  talkId: 'default',
                  talkDetail: {
                    textList: ['Now change the number in the middle.'],
                    arrowDirection: 'left',
                  },
                },
                {
                  elementName: 'DevelopWindowsElement',
                  domId: 'lesson-develop-windows',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'AWh3LE87WzNkW8rFkeu1yNAno8sqhL+VdoEXN940GY2wXFxpec+jUHm3WEsTXQmPJp6W7JQrwaywDTrTFQcGAQ==',
                  },
                  editorWindowsList: [
                    [
                      {
                        windowId: 'Editor1',
                        sizeAndPosition: {
                          height: '58.5%',
                          width: '41%',
                          top: '41.5%',
                          left: '59%',
                        },
                        theme: 'chaos',
                        highlightCssClass: 'flash-dark',
                        onFocusCssClass: 'normal-highlight',
                        editAreaList: [
                          {
                            startRow: 0,
                            endRow: 0,
                          },
                        ],
                        mode: 'javascript',
                        file: 'top_editor.js',
                        tabName: 'JavaScript',
                        editorWindowId: 'Editor',
                        restrictCursorRow: true,
                        tabSelected: true,
                      },
                    ],
                  ],
                  previewWindowList: [
                    {
                      windowId: 'preview',
                      sizeAndPosition: {
                        top: '0%',
                        left: '0%',
                        width: '58%',
                        height: '100%',
                      },
                      file: 'lesson02-main.html',
                    },
                  ],
                  snap: 'lesson02-main',
                  validationFile: 'top_test.js',
                },
                {
                  elementName: 'FlipCardElement',
                  domId: 'lesson-hint',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'AWh3LE87WzNkW8rFkeu1yNAno8sqhL+VdoEXN940GY2wXFxpec+jUHm3WEsTXQmPJp6W7JQrwaywDTrTFQcGAQ==',
                  },
                  cardContentUrlList: [
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson02-main_1.html',
                  ],
                  flipButtonText: ['ヒントを見る', '次のヒント'],
                  sizeAndPosition: {
                    height: '40%',
                    width: '41%',
                    top: '0%',
                    left: '59%',
                  },
                  guideButtons: {
                    hintTalk: {
                      src: [
                        {
                          en: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/g_mickey_1_hint_004.mp3',
                          es: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/es/g_mickey_1_hint_004.mp3',
                        },
                      ],
                      className: 'hint-talk',
                      icon: 'volume-up',
                    },
                  },
                },
              ],
              enterBehaviourList: [],
              exitCondition: {
                type: 'AND',
                detailList: ['TalkFinish:mimil:default'],
              },
              exitBehaviourList: [],
              metaData: {
                stepId: 32,
                stepType: {
                  type: 'talk',
                  snapType: '',
                  layout: 'ERH1',
                  onlyMove: false,
                  talkId: 'default',
                  domId: 'mimil',
                },
                preloadUrlList: [
                  '/api/shared/mp3/talk/mickey/g_mickey_1/g_mickey_1_014.mp3',
                  '/api/shared/mp3/talk/mickey/g_mickey_1/es/g_mickey_1_014.mp3',
                ],
                customUpdateRuleList: [],
                uniqueId:
                  'AWh3LE87WzNkW8rFkeu1yNAno8sqhL+VdoEXN940GY2wXFxpec+jUHm3WEsTXQmPJp6W7JQrwaywDTrTFQcGAQ==',
              },
            },
            {
              stepId: 33,
              bgm: {
                src: '/api/shared/mp3/BGM00_gemlesson.mp3',
              },
              defaultNextStepId: 34,
              elementList: [
                {
                  elementName: 'FlashElement',
                  domId: 'mimil',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'frZtvTiOqUEUUbtCPwp1z8gYkODS9N1a/rDvLIS40Hmf+hywjLWnRMltWJ7kBaNwMpXLbY487XfWksn02pJrtQ==',
                  },
                  flashName: 'mimil',
                  sizeAndPosition: {
                    left: '85%',
                    top: '15%',
                    width: null,
                    height: null,
                  },
                  isImage: false,
                  isDraggable: true,
                  playSerifTalk: {
                    src: {
                      en: '/api/shared/mp3/talk/mickey/g_mickey_1/g_mickey_1_016.mp3',
                      es: '/api/shared/mp3/talk/mickey/g_mickey_1/es/g_mickey_1_016.mp3',
                    },
                  },
                },
                {
                  elementName: 'DevelopWindowsElement',
                  domId: 'lesson-develop-windows',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'frZtvTiOqUEUUbtCPwp1z8gYkODS9N1a/rDvLIS40Hmf+hywjLWnRMltWJ7kBaNwMpXLbY487XfWksn02pJrtQ==',
                  },
                  editorWindowsList: [
                    [
                      {
                        windowId: 'Editor1',
                        sizeAndPosition: {
                          height: '58.5%',
                          width: '41%',
                          top: '41.5%',
                          left: '59%',
                        },
                        theme: 'chaos',
                        highlightCssClass: 'flash-dark',
                        onFocusCssClass: 'normal-highlight',
                        editAreaList: [
                          {
                            startRow: 0,
                            endRow: 0,
                          },
                        ],
                        mode: 'javascript',
                        file: 'top_editor.js',
                        tabName: 'JavaScript',
                        editorWindowId: 'Editor',
                        restrictCursorRow: true,
                        tabSelected: true,
                      },
                    ],
                  ],
                  previewWindowList: [
                    {
                      windowId: 'preview',
                      sizeAndPosition: {
                        top: '0%',
                        left: '0%',
                        width: '58%',
                        height: '100%',
                      },
                      file: 'lesson02-main.html',
                    },
                  ],
                  snap: 'lesson02-main',
                  validationFile: 'top_test.js',
                },
                {
                  elementName: 'FlipCardElement',
                  domId: 'lesson-hint',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'frZtvTiOqUEUUbtCPwp1z8gYkODS9N1a/rDvLIS40Hmf+hywjLWnRMltWJ7kBaNwMpXLbY487XfWksn02pJrtQ==',
                  },
                  cardContentUrlList: [
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson02-main_1.html',
                  ],
                  flipButtonText: ['ヒントを見る', '次のヒント'],
                  sizeAndPosition: {
                    height: '40%',
                    width: '41%',
                    top: '0%',
                    left: '59%',
                  },
                  guideButtons: {
                    hintTalk: {
                      src: [
                        {
                          en: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/g_mickey_1_hint_004.mp3',
                          es: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/es/g_mickey_1_hint_004.mp3',
                        },
                      ],
                      className: 'hint-talk',
                      icon: 'volume-up',
                    },
                  },
                },
              ],
              enterBehaviourList: [],
              exitCondition: {
                type: 'AND',
                detailList: ['AnimationFinish:mimil'],
              },
              exitBehaviourList: [],
              metaData: {
                stepId: 33,
                stepType: {
                  type: 'talk',
                  snapType: '',
                  layout: 'ERH1',
                  onlyMove: true,
                },
                preloadUrlList: [
                  '/api/shared/mp3/talk/mickey/g_mickey_1/g_mickey_1_016.mp3',
                  '/api/shared/mp3/talk/mickey/g_mickey_1/es/g_mickey_1_016.mp3',
                ],
                customUpdateRuleList: [],
                uniqueId:
                  'frZtvTiOqUEUUbtCPwp1z8gYkODS9N1a/rDvLIS40Hmf+hywjLWnRMltWJ7kBaNwMpXLbY487XfWksn02pJrtQ==',
              },
            },
            {
              stepId: 34,
              bgm: {
                src: '/api/shared/mp3/BGM00_gemlesson.mp3',
              },
              defaultNextStepId: 35,
              elementList: [
                {
                  elementName: 'FlashElement',
                  domId: 'mimil',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'pGHlZ5urAf8QGoKKu5FEnWRXldN5RzWlXe1cUPIj05hg387LUGjXQa0PPz+mcZTYUV8raqFxfExsijeu0eRo+A==',
                  },
                  flashName: 'mimil',
                  sizeAndPosition: {
                    left: '85%',
                    top: '15%',
                    width: null,
                    height: null,
                  },
                  isImage: false,
                  isDraggable: true,
                },
                {
                  elementName: 'DevelopWindowsElement',
                  domId: 'lesson-develop-windows',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'pGHlZ5urAf8QGoKKu5FEnWRXldN5RzWlXe1cUPIj05hg387LUGjXQa0PPz+mcZTYUV8raqFxfExsijeu0eRo+A==',
                  },
                  editorWindowsList: [
                    [
                      {
                        windowId: 'Editor1',
                        sizeAndPosition: {
                          height: '58.5%',
                          width: '41%',
                          top: '41.5%',
                          left: '59%',
                        },
                        theme: 'chaos',
                        highlightCssClass: 'flash-dark',
                        onFocusCssClass: 'normal-highlight',
                        editAreaList: [
                          {
                            startRow: 0,
                            endRow: 0,
                          },
                        ],
                        mode: 'javascript',
                        file: 'top_editor.js',
                        tabName: 'JavaScript',
                        editorWindowId: 'Editor',
                        restrictCursorRow: true,
                        tabSelected: true,
                      },
                    ],
                  ],
                  previewWindowList: [
                    {
                      windowId: 'preview',
                      sizeAndPosition: {
                        top: '0%',
                        left: '0%',
                        width: '58%',
                        height: '100%',
                      },
                      file: 'lesson03-main.html',
                    },
                  ],
                  snap: 'lesson03-main',
                  validationFile: 'top_test.js',
                },
                {
                  elementName: 'FlipCardElement',
                  domId: 'lesson-hint',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'pGHlZ5urAf8QGoKKu5FEnWRXldN5RzWlXe1cUPIj05hg387LUGjXQa0PPz+mcZTYUV8raqFxfExsijeu0eRo+A==',
                  },
                  cardContentUrlList: [
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson03-main_1.html',
                  ],
                  flipButtonText: ['ヒントを見る', '次のヒント'],
                  sizeAndPosition: {
                    height: '40%',
                    width: '41%',
                    top: '0%',
                    left: '59%',
                  },
                  guideButtons: {
                    hintTalk: {
                      src: [
                        {
                          en: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/g_mickey_1_hint_005.mp3',
                          es: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/es/g_mickey_1_hint_005.mp3',
                        },
                      ],
                      className: 'hint-talk',
                      icon: 'volume-up',
                    },
                  },
                },
              ],
              enterBehaviourList: [],
              exitCondition: {
                type: 'AND',
                detailList: ['ValidationFinish:lesson-develop-windows:success'],
              },
              exitBehaviourList: [],
              metaData: {
                stepId: 34,
                stepType: {
                  type: 'lesson',
                  snapType: '',
                  layout: 'ERH1',
                },
                preloadUrlList: [
                  '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/g_mickey_1_hint_005.mp3',
                  '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/es/g_mickey_1_hint_005.mp3',
                  '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson03-main_1.html',
                ],
                customUpdateRuleList: [],
                lessonName: 'Change the numbers within ellipse (2)',
                isLesson: true,
                uniqueId:
                  'pGHlZ5urAf8QGoKKu5FEnWRXldN5RzWlXe1cUPIj05hg387LUGjXQa0PPz+mcZTYUV8raqFxfExsijeu0eRo+A==',
              },
            },
            {
              stepId: 35,
              bgm: {
                src: '/api/shared/mp3/BGM00_gemlesson.mp3',
              },
              defaultNextStepId: 36,
              elementList: [
                {
                  elementName: 'FlashElement',
                  domId: 'mimil',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'DAR0KcbenA0k43lqllTahhBwsG81AWKnLUKrGRtilo2gXTNSbh5oTWOF4KIcDCBCqP6zwLPPQYSDEY+Jl7EuBg==',
                  },
                  flashName: 'mimil',
                  sizeAndPosition: {
                    left: '85%',
                    top: '50%',
                    width: null,
                    height: null,
                  },
                  isImage: false,
                  isDraggable: true,
                },
                {
                  elementName: 'DevelopWindowsElement',
                  domId: 'lesson-develop-windows',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'DAR0KcbenA0k43lqllTahhBwsG81AWKnLUKrGRtilo2gXTNSbh5oTWOF4KIcDCBCqP6zwLPPQYSDEY+Jl7EuBg==',
                  },
                  editorWindowsList: [
                    [
                      {
                        windowId: 'Editor1',
                        sizeAndPosition: {
                          height: '58.5%',
                          width: '41%',
                          top: '41.5%',
                          left: '59%',
                        },
                        theme: 'chaos',
                        highlightCssClass: 'flash-dark',
                        onFocusCssClass: 'normal-highlight',
                        editAreaList: [
                          {
                            startRow: 0,
                            endRow: 0,
                          },
                        ],
                        mode: 'javascript',
                        file: 'top_editor.js',
                        tabName: 'JavaScript',
                        editorWindowId: 'Editor',
                        restrictCursorRow: true,
                        tabSelected: true,
                      },
                    ],
                  ],
                  previewWindowList: [
                    {
                      windowId: 'preview',
                      sizeAndPosition: {
                        top: '0%',
                        left: '0%',
                        width: '58%',
                        height: '100%',
                      },
                      file: 'lesson03-main.html',
                    },
                  ],
                  snap: 'lesson03-main',
                  validationFile: 'top_test.js',
                },
                {
                  elementName: 'FlipCardElement',
                  domId: 'lesson-hint',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'DAR0KcbenA0k43lqllTahhBwsG81AWKnLUKrGRtilo2gXTNSbh5oTWOF4KIcDCBCqP6zwLPPQYSDEY+Jl7EuBg==',
                  },
                  cardContentUrlList: [
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson03-main_1.html',
                  ],
                  flipButtonText: ['ヒントを見る', '次のヒント'],
                  sizeAndPosition: {
                    height: '40%',
                    width: '41%',
                    top: '0%',
                    left: '59%',
                  },
                  guideButtons: {
                    hintTalk: {
                      src: [
                        {
                          en: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/g_mickey_1_hint_005.mp3',
                          es: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/es/g_mickey_1_hint_005.mp3',
                        },
                      ],
                      className: 'hint-talk',
                      icon: 'volume-up',
                    },
                  },
                },
              ],
              enterBehaviourList: [],
              exitCondition: {
                type: 'AND',
                detailList: ['AnimationFinish:mimil'],
              },
              exitBehaviourList: [],
              metaData: {
                stepId: 35,
                stepType: {
                  type: 'talk',
                  snapType: '',
                  layout: 'ERH1',
                  onlyMove: true,
                },
                preloadUrlList: [],
                customUpdateRuleList: [],
                uniqueId:
                  'DAR0KcbenA0k43lqllTahhBwsG81AWKnLUKrGRtilo2gXTNSbh5oTWOF4KIcDCBCqP6zwLPPQYSDEY+Jl7EuBg==',
              },
            },
            {
              stepId: 36,
              bgm: {
                src: '/api/shared/mp3/BGM00_gemlesson.mp3',
              },
              defaultNextStepId: 37,
              elementList: [
                {
                  elementName: 'FlashElement',
                  domId: 'mimil',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'DAR0KcbenA0k43lqllTahhBwsG81AWKnLUKrGRtilo2gXTNSbh5oTWOF4KIcDCBCqP6zwLPPQYSDEY+Jl7EuBg==',
                  },
                  flashName: 'mimil',
                  sizeAndPosition: {
                    left: '85%',
                    top: '50%',
                    width: null,
                    height: null,
                  },
                  isImage: false,
                  isDraggable: true,
                  playSerifTalk: {
                    src: {
                      en: '/api/shared/mp3/talk/mickey/g_mickey_1/g_mickey_1_015.mp3',
                      es: '/api/shared/mp3/talk/mickey/g_mickey_1/es/g_mickey_1_015.mp3',
                    },
                  },
                  talkId: 'default',
                  talkDetail: {
                    textList: [
                      'Wonderful! The circle moved down! The number in the middle decides how far the circle is from the top of the screen.',
                    ],
                    arrowDirection: 'right',
                  },
                },
                {
                  elementName: 'DevelopWindowsElement',
                  domId: 'lesson-develop-windows',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'DAR0KcbenA0k43lqllTahhBwsG81AWKnLUKrGRtilo2gXTNSbh5oTWOF4KIcDCBCqP6zwLPPQYSDEY+Jl7EuBg==',
                  },
                  editorWindowsList: [
                    [
                      {
                        windowId: 'Editor1',
                        sizeAndPosition: {
                          height: '58.5%',
                          width: '41%',
                          top: '41.5%',
                          left: '59%',
                        },
                        theme: 'chaos',
                        highlightCssClass: 'flash-dark',
                        onFocusCssClass: 'normal-highlight',
                        editAreaList: [
                          {
                            startRow: 0,
                            endRow: 0,
                          },
                        ],
                        mode: 'javascript',
                        file: 'top_editor.js',
                        tabName: 'JavaScript',
                        editorWindowId: 'Editor',
                        restrictCursorRow: true,
                        tabSelected: true,
                      },
                    ],
                  ],
                  previewWindowList: [
                    {
                      windowId: 'preview',
                      sizeAndPosition: {
                        top: '0%',
                        left: '0%',
                        width: '58%',
                        height: '100%',
                      },
                      file: 'lesson03-main.html',
                    },
                  ],
                  snap: 'lesson03-main',
                  validationFile: 'top_test.js',
                },
                {
                  elementName: 'FlipCardElement',
                  domId: 'lesson-hint',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'DAR0KcbenA0k43lqllTahhBwsG81AWKnLUKrGRtilo2gXTNSbh5oTWOF4KIcDCBCqP6zwLPPQYSDEY+Jl7EuBg==',
                  },
                  cardContentUrlList: [
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson03-main_1.html',
                  ],
                  flipButtonText: ['ヒントを見る', '次のヒント'],
                  sizeAndPosition: {
                    height: '40%',
                    width: '41%',
                    top: '0%',
                    left: '59%',
                  },
                  guideButtons: {
                    hintTalk: {
                      src: [
                        {
                          en: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/g_mickey_1_hint_005.mp3',
                          es: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/es/g_mickey_1_hint_005.mp3',
                        },
                      ],
                      className: 'hint-talk',
                      icon: 'volume-up',
                    },
                  },
                },
              ],
              enterBehaviourList: [],
              exitCondition: {
                type: 'AND',
                detailList: ['TalkFinish:mimil:default'],
              },
              exitBehaviourList: [],
              metaData: {
                stepId: 36,
                stepType: {
                  type: 'talk',
                  snapType: '',
                  layout: 'ERH1',
                  onlyMove: false,
                  talkId: 'default',
                  domId: 'mimil',
                },
                preloadUrlList: [
                  '/api/shared/mp3/talk/mickey/g_mickey_1/g_mickey_1_015.mp3',
                  '/api/shared/mp3/talk/mickey/g_mickey_1/es/g_mickey_1_015.mp3',
                ],
                customUpdateRuleList: [],
                uniqueId:
                  'DAR0KcbenA0k43lqllTahhBwsG81AWKnLUKrGRtilo2gXTNSbh5oTWOF4KIcDCBCqP6zwLPPQYSDEY+Jl7EuBg==',
              },
            },
            {
              stepId: 37,
              bgm: {
                src: '/api/shared/mp3/BGM00_gemlesson.mp3',
              },
              defaultNextStepId: 38,
              elementList: [
                {
                  elementName: 'FlashElement',
                  domId: 'mimil',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'HeQwDjHb2eORQQgbke1tw7vOjwg1+87Tp7CT/bd++AGvSvmhWk/gIU9Ywy6ckzjpiCEC4MQDXHnWadyJb0CDAw==',
                  },
                  flashName: 'mimil',
                  sizeAndPosition: {
                    left: '85%',
                    top: '15%',
                    width: null,
                    height: null,
                  },
                  isImage: false,
                  isDraggable: true,
                },
                {
                  elementName: 'DevelopWindowsElement',
                  domId: 'lesson-develop-windows',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'HeQwDjHb2eORQQgbke1tw7vOjwg1+87Tp7CT/bd++AGvSvmhWk/gIU9Ywy6ckzjpiCEC4MQDXHnWadyJb0CDAw==',
                  },
                  editorWindowsList: [
                    [
                      {
                        windowId: 'Editor1',
                        sizeAndPosition: {
                          height: '58.5%',
                          width: '41%',
                          top: '41.5%',
                          left: '59%',
                        },
                        theme: 'chaos',
                        highlightCssClass: 'flash-dark',
                        onFocusCssClass: 'normal-highlight',
                        editAreaList: [
                          {
                            startRow: 0,
                            endRow: 0,
                          },
                        ],
                        mode: 'javascript',
                        file: 'top_editor.js',
                        tabName: 'JavaScript',
                        editorWindowId: 'Editor',
                        restrictCursorRow: true,
                        tabSelected: true,
                      },
                    ],
                  ],
                  previewWindowList: [
                    {
                      windowId: 'preview',
                      sizeAndPosition: {
                        top: '0%',
                        left: '0%',
                        width: '58%',
                        height: '100%',
                      },
                      file: 'lesson03-main.html',
                    },
                  ],
                  snap: 'lesson03-main',
                  validationFile: 'top_test.js',
                },
                {
                  elementName: 'FlipCardElement',
                  domId: 'lesson-hint',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'HeQwDjHb2eORQQgbke1tw7vOjwg1+87Tp7CT/bd++AGvSvmhWk/gIU9Ywy6ckzjpiCEC4MQDXHnWadyJb0CDAw==',
                  },
                  cardContentUrlList: [
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson03-main_1.html',
                  ],
                  flipButtonText: ['ヒントを見る', '次のヒント'],
                  sizeAndPosition: {
                    height: '40%',
                    width: '41%',
                    top: '0%',
                    left: '59%',
                  },
                  guideButtons: {
                    hintTalk: {
                      src: [
                        {
                          en: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/g_mickey_1_hint_005.mp3',
                          es: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/es/g_mickey_1_hint_005.mp3',
                        },
                      ],
                      className: 'hint-talk',
                      icon: 'volume-up',
                    },
                  },
                },
              ],
              enterBehaviourList: [],
              exitCondition: {
                type: 'AND',
                detailList: ['AnimationFinish:mimil'],
              },
              exitBehaviourList: [],
              metaData: {
                stepId: 37,
                stepType: {
                  type: 'talk',
                  snapType: '',
                  layout: 'ERH1',
                  onlyMove: true,
                },
                preloadUrlList: [],
                customUpdateRuleList: [],
                uniqueId:
                  'HeQwDjHb2eORQQgbke1tw7vOjwg1+87Tp7CT/bd++AGvSvmhWk/gIU9Ywy6ckzjpiCEC4MQDXHnWadyJb0CDAw==',
              },
            },
            {
              stepId: 38,
              bgm: {
                src: '/api/shared/mp3/BGM00_gemlesson.mp3',
              },
              defaultNextStepId: 39,
              elementList: [
                {
                  elementName: 'FlashElement',
                  domId: 'mimil',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'HeQwDjHb2eORQQgbke1tw7vOjwg1+87Tp7CT/bd++AGvSvmhWk/gIU9Ywy6ckzjpiCEC4MQDXHnWadyJb0CDAw==',
                  },
                  flashName: 'mimil',
                  sizeAndPosition: {
                    left: '85%',
                    top: '15%',
                    width: null,
                    height: null,
                  },
                  isImage: false,
                  isDraggable: true,
                  playSerifTalk: {
                    src: {
                      en: '/api/shared/mp3/talk/mickey/g_mickey_1/g_mickey_1_016.mp3',
                      es: '/api/shared/mp3/talk/mickey/g_mickey_1/es/g_mickey_1_016.mp3',
                    },
                  },
                  talkId: 'default',
                  talkDetail: {
                    textList: ['Okay, now change the last number.'],
                    arrowDirection: 'right',
                  },
                },
                {
                  elementName: 'DevelopWindowsElement',
                  domId: 'lesson-develop-windows',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'HeQwDjHb2eORQQgbke1tw7vOjwg1+87Tp7CT/bd++AGvSvmhWk/gIU9Ywy6ckzjpiCEC4MQDXHnWadyJb0CDAw==',
                  },
                  editorWindowsList: [
                    [
                      {
                        windowId: 'Editor1',
                        sizeAndPosition: {
                          height: '58.5%',
                          width: '41%',
                          top: '41.5%',
                          left: '59%',
                        },
                        theme: 'chaos',
                        highlightCssClass: 'flash-dark',
                        onFocusCssClass: 'normal-highlight',
                        editAreaList: [
                          {
                            startRow: 0,
                            endRow: 0,
                          },
                        ],
                        mode: 'javascript',
                        file: 'top_editor.js',
                        tabName: 'JavaScript',
                        editorWindowId: 'Editor',
                        restrictCursorRow: true,
                        tabSelected: true,
                      },
                    ],
                  ],
                  previewWindowList: [
                    {
                      windowId: 'preview',
                      sizeAndPosition: {
                        top: '0%',
                        left: '0%',
                        width: '58%',
                        height: '100%',
                      },
                      file: 'lesson03-main.html',
                    },
                  ],
                  snap: 'lesson03-main',
                  validationFile: 'top_test.js',
                },
                {
                  elementName: 'FlipCardElement',
                  domId: 'lesson-hint',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'HeQwDjHb2eORQQgbke1tw7vOjwg1+87Tp7CT/bd++AGvSvmhWk/gIU9Ywy6ckzjpiCEC4MQDXHnWadyJb0CDAw==',
                  },
                  cardContentUrlList: [
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson03-main_1.html',
                  ],
                  flipButtonText: ['ヒントを見る', '次のヒント'],
                  sizeAndPosition: {
                    height: '40%',
                    width: '41%',
                    top: '0%',
                    left: '59%',
                  },
                  guideButtons: {
                    hintTalk: {
                      src: [
                        {
                          en: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/g_mickey_1_hint_005.mp3',
                          es: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/es/g_mickey_1_hint_005.mp3',
                        },
                      ],
                      className: 'hint-talk',
                      icon: 'volume-up',
                    },
                  },
                },
              ],
              enterBehaviourList: [],
              exitCondition: {
                type: 'AND',
                detailList: ['TalkFinish:mimil:default'],
              },
              exitBehaviourList: [],
              metaData: {
                stepId: 38,
                stepType: {
                  type: 'talk',
                  snapType: '',
                  layout: 'ERH1',
                  onlyMove: false,
                  talkId: 'default',
                  domId: 'mimil',
                },
                preloadUrlList: [
                  '/api/shared/mp3/talk/mickey/g_mickey_1/g_mickey_1_016.mp3',
                  '/api/shared/mp3/talk/mickey/g_mickey_1/es/g_mickey_1_016.mp3',
                ],
                customUpdateRuleList: [],
                uniqueId:
                  'HeQwDjHb2eORQQgbke1tw7vOjwg1+87Tp7CT/bd++AGvSvmhWk/gIU9Ywy6ckzjpiCEC4MQDXHnWadyJb0CDAw==',
              },
            },
            {
              stepId: 39,
              bgm: {
                src: '/api/shared/mp3/BGM00_gemlesson.mp3',
              },
              defaultNextStepId: 40,
              elementList: [
                {
                  elementName: 'FlashElement',
                  domId: 'mimil',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'd+j/XqQX6+YSKf1ZfRFWZ/i5XrnvFFbewATii/opd8m+lvPY2wG/4BIWdMUoLfv5IRPLEXP1lFeEbMPao1pjYQ==',
                  },
                  flashName: 'mimil',
                  sizeAndPosition: {
                    left: '85%',
                    top: '15%',
                    width: null,
                    height: null,
                  },
                  isImage: false,
                  isDraggable: true,
                  playSerifTalk: {
                    src: {
                      en: '/api/shared/mp3/talk/mickey/g_mickey_1/g_mickey_1_019.mp3',
                      es: '/api/shared/mp3/talk/mickey/g_mickey_1/es/g_mickey_1_019.mp3',
                    },
                  },
                },
                {
                  elementName: 'DevelopWindowsElement',
                  domId: 'lesson-develop-windows',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'd+j/XqQX6+YSKf1ZfRFWZ/i5XrnvFFbewATii/opd8m+lvPY2wG/4BIWdMUoLfv5IRPLEXP1lFeEbMPao1pjYQ==',
                  },
                  editorWindowsList: [
                    [
                      {
                        windowId: 'Editor1',
                        sizeAndPosition: {
                          height: '58.5%',
                          width: '41%',
                          top: '41.5%',
                          left: '59%',
                        },
                        theme: 'chaos',
                        highlightCssClass: 'flash-dark',
                        onFocusCssClass: 'normal-highlight',
                        editAreaList: [
                          {
                            startRow: 0,
                            endRow: 0,
                          },
                        ],
                        mode: 'javascript',
                        file: 'top_editor.js',
                        tabName: 'JavaScript',
                        editorWindowId: 'Editor',
                        restrictCursorRow: true,
                        tabSelected: true,
                      },
                    ],
                  ],
                  previewWindowList: [
                    {
                      windowId: 'preview',
                      sizeAndPosition: {
                        top: '0%',
                        left: '0%',
                        width: '58%',
                        height: '100%',
                      },
                      file: 'lesson03-main.html',
                    },
                  ],
                  snap: 'lesson03-main',
                  validationFile: 'top_test.js',
                },
                {
                  elementName: 'FlipCardElement',
                  domId: 'lesson-hint',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'd+j/XqQX6+YSKf1ZfRFWZ/i5XrnvFFbewATii/opd8m+lvPY2wG/4BIWdMUoLfv5IRPLEXP1lFeEbMPao1pjYQ==',
                  },
                  cardContentUrlList: [
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson03-main_1.html',
                  ],
                  flipButtonText: ['ヒントを見る', '次のヒント'],
                  sizeAndPosition: {
                    height: '40%',
                    width: '41%',
                    top: '0%',
                    left: '59%',
                  },
                  guideButtons: {
                    hintTalk: {
                      src: [
                        {
                          en: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/g_mickey_1_hint_005.mp3',
                          es: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/es/g_mickey_1_hint_005.mp3',
                        },
                      ],
                      className: 'hint-talk',
                      icon: 'volume-up',
                    },
                  },
                },
              ],
              enterBehaviourList: [],
              exitCondition: {},
              exitBehaviourList: [],
              metaData: {
                stepId: 39,
                stepType: {
                  type: 'talk',
                  snapType: '',
                  layout: 'ERH1',
                  onlyMove: true,
                },
                preloadUrlList: [
                  '/api/shared/mp3/talk/mickey/g_mickey_1/g_mickey_1_019.mp3',
                  '/api/shared/mp3/talk/mickey/g_mickey_1/es/g_mickey_1_019.mp3',
                ],
                customUpdateRuleList: [],
                uniqueId:
                  'd+j/XqQX6+YSKf1ZfRFWZ/i5XrnvFFbewATii/opd8m+lvPY2wG/4BIWdMUoLfv5IRPLEXP1lFeEbMPao1pjYQ==',
              },
            },
            {
              stepId: 40,
              bgm: {
                src: '/api/shared/mp3/BGM00_gemlesson.mp3',
              },
              defaultNextStepId: 41,
              elementList: [
                {
                  elementName: 'FlashElement',
                  domId: 'mimil',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'CRaKkWRsCqscwPx9ye/Foh6t1y7L+DJqC9OdJThUu1d0NcQWyOhSH0YE6yyW51vnHKWnn+QnCJRa/cD5IGrlBA==',
                  },
                  flashName: 'mimil',
                  sizeAndPosition: {
                    left: '85%',
                    top: '15%',
                    width: null,
                    height: null,
                  },
                  isImage: false,
                  isDraggable: true,
                },
                {
                  elementName: 'DevelopWindowsElement',
                  domId: 'lesson-develop-windows',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'CRaKkWRsCqscwPx9ye/Foh6t1y7L+DJqC9OdJThUu1d0NcQWyOhSH0YE6yyW51vnHKWnn+QnCJRa/cD5IGrlBA==',
                  },
                  editorWindowsList: [
                    [
                      {
                        windowId: 'Editor1',
                        sizeAndPosition: {
                          height: '58.5%',
                          width: '41%',
                          top: '41.5%',
                          left: '59%',
                        },
                        theme: 'chaos',
                        highlightCssClass: 'flash-dark',
                        onFocusCssClass: 'normal-highlight',
                        editAreaList: [
                          {
                            startRow: 0,
                            endRow: 0,
                          },
                        ],
                        mode: 'javascript',
                        file: 'top_editor.js',
                        tabName: 'JavaScript',
                        editorWindowId: 'Editor',
                        restrictCursorRow: true,
                        tabSelected: true,
                      },
                    ],
                  ],
                  previewWindowList: [
                    {
                      windowId: 'preview',
                      sizeAndPosition: {
                        top: '0%',
                        left: '0%',
                        width: '58%',
                        height: '100%',
                      },
                      file: 'lesson04-main.html',
                    },
                  ],
                  snap: 'lesson04-main',
                  validationFile: 'top_test.js',
                },
                {
                  elementName: 'FlipCardElement',
                  domId: 'lesson-hint',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'CRaKkWRsCqscwPx9ye/Foh6t1y7L+DJqC9OdJThUu1d0NcQWyOhSH0YE6yyW51vnHKWnn+QnCJRa/cD5IGrlBA==',
                  },
                  cardContentUrlList: [
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson04-main_1.html',
                  ],
                  flipButtonText: ['ヒントを見る', '次のヒント'],
                  sizeAndPosition: {
                    height: '40%',
                    width: '41%',
                    top: '0%',
                    left: '59%',
                  },
                  guideButtons: {
                    hintTalk: {
                      src: [
                        {
                          en: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/g_mickey_1_hint_006.mp3',
                          es: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/es/g_mickey_1_hint_006.mp3',
                        },
                      ],
                      className: 'hint-talk',
                      icon: 'volume-up',
                    },
                  },
                },
              ],
              enterBehaviourList: [],
              exitCondition: {
                type: 'AND',
                detailList: ['ValidationFinish:lesson-develop-windows:success'],
              },
              exitBehaviourList: [],
              metaData: {
                stepId: 40,
                stepType: {
                  type: 'lesson',
                  snapType: '',
                  layout: 'ERH1',
                },
                preloadUrlList: [
                  '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/g_mickey_1_hint_006.mp3',
                  '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/es/g_mickey_1_hint_006.mp3',
                  '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson04-main_1.html',
                ],
                customUpdateRuleList: [],
                lessonName: 'Change the numbers within ellipse (3)',
                isLesson: true,
                uniqueId:
                  'CRaKkWRsCqscwPx9ye/Foh6t1y7L+DJqC9OdJThUu1d0NcQWyOhSH0YE6yyW51vnHKWnn+QnCJRa/cD5IGrlBA==',
              },
            },
            {
              stepId: 41,
              bgm: {
                src: '/api/shared/mp3/BGM00_gemlesson.mp3',
              },
              defaultNextStepId: 42,
              elementList: [
                {
                  elementName: 'FlashElement',
                  domId: 'mimil',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      '7iTkECg94zRBYBrG1tr22VOTdhHStqforUPbcCwhd//sYyfNLVzgZoj6QytHvisp2ia+mNTaN3KQnhl+9giO5w==',
                  },
                  flashName: 'mimil',
                  sizeAndPosition: {
                    left: '40%',
                    top: '45%',
                    width: null,
                    height: null,
                  },
                  isImage: false,
                  isDraggable: true,
                },
                {
                  elementName: 'DevelopWindowsElement',
                  domId: 'lesson-develop-windows',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      '7iTkECg94zRBYBrG1tr22VOTdhHStqforUPbcCwhd//sYyfNLVzgZoj6QytHvisp2ia+mNTaN3KQnhl+9giO5w==',
                  },
                  editorWindowsList: [
                    [
                      {
                        windowId: 'Editor1',
                        sizeAndPosition: {
                          height: '58.5%',
                          width: '41%',
                          top: '41.5%',
                          left: '59%',
                        },
                        theme: 'chaos',
                        highlightCssClass: 'flash-dark',
                        onFocusCssClass: 'normal-highlight',
                        editAreaList: [
                          {
                            startRow: 0,
                            endRow: 0,
                          },
                        ],
                        mode: 'javascript',
                        file: 'top_editor.js',
                        tabName: 'JavaScript',
                        editorWindowId: 'Editor',
                        restrictCursorRow: true,
                        tabSelected: true,
                      },
                    ],
                  ],
                  previewWindowList: [
                    {
                      windowId: 'preview',
                      sizeAndPosition: {
                        top: '0%',
                        left: '0%',
                        width: '58%',
                        height: '100%',
                      },
                      file: 'lesson04-main.html',
                    },
                  ],
                  snap: 'lesson04-main',
                  validationFile: 'top_test.js',
                },
                {
                  elementName: 'FlipCardElement',
                  domId: 'lesson-hint',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      '7iTkECg94zRBYBrG1tr22VOTdhHStqforUPbcCwhd//sYyfNLVzgZoj6QytHvisp2ia+mNTaN3KQnhl+9giO5w==',
                  },
                  cardContentUrlList: [
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson04-main_1.html',
                  ],
                  flipButtonText: ['ヒントを見る', '次のヒント'],
                  sizeAndPosition: {
                    height: '40%',
                    width: '41%',
                    top: '0%',
                    left: '59%',
                  },
                  guideButtons: {
                    hintTalk: {
                      src: [
                        {
                          en: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/g_mickey_1_hint_006.mp3',
                          es: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/es/g_mickey_1_hint_006.mp3',
                        },
                      ],
                      className: 'hint-talk',
                      icon: 'volume-up',
                    },
                  },
                },
              ],
              enterBehaviourList: [],
              exitCondition: {
                type: 'AND',
                detailList: ['AnimationFinish:mimil'],
              },
              exitBehaviourList: [],
              metaData: {
                stepId: 41,
                stepType: {
                  type: 'talk',
                  snapType: '',
                  layout: 'ERH1',
                  onlyMove: true,
                },
                preloadUrlList: [],
                customUpdateRuleList: [],
                uniqueId:
                  '7iTkECg94zRBYBrG1tr22VOTdhHStqforUPbcCwhd//sYyfNLVzgZoj6QytHvisp2ia+mNTaN3KQnhl+9giO5w==',
              },
            },
            {
              stepId: 42,
              bgm: {
                src: '/api/shared/mp3/BGM00_gemlesson.mp3',
              },
              defaultNextStepId: 43,
              elementList: [
                {
                  elementName: 'FlashElement',
                  domId: 'mimil',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      '7iTkECg94zRBYBrG1tr22VOTdhHStqforUPbcCwhd//sYyfNLVzgZoj6QytHvisp2ia+mNTaN3KQnhl+9giO5w==',
                  },
                  flashName: 'mimil',
                  sizeAndPosition: {
                    left: '40%',
                    top: '45%',
                    width: null,
                    height: null,
                  },
                  isImage: false,
                  isDraggable: true,
                  playSerifTalk: {
                    src: {
                      en: '/api/shared/mp3/talk/mickey/g_mickey_1/g_mickey_1_017.mp3',
                      es: '/api/shared/mp3/talk/mickey/g_mickey_1/es/g_mickey_1_017.mp3',
                    },
                  },
                  talkId: 'default',
                  talkDetail: {
                    textList: [
                      'It got bigger! The third number decides the size of the circle!',
                    ],
                    arrowDirection: 'left',
                  },
                },
                {
                  elementName: 'DevelopWindowsElement',
                  domId: 'lesson-develop-windows',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      '7iTkECg94zRBYBrG1tr22VOTdhHStqforUPbcCwhd//sYyfNLVzgZoj6QytHvisp2ia+mNTaN3KQnhl+9giO5w==',
                  },
                  editorWindowsList: [
                    [
                      {
                        windowId: 'Editor1',
                        sizeAndPosition: {
                          height: '58.5%',
                          width: '41%',
                          top: '41.5%',
                          left: '59%',
                        },
                        theme: 'chaos',
                        highlightCssClass: 'flash-dark',
                        onFocusCssClass: 'normal-highlight',
                        editAreaList: [
                          {
                            startRow: 0,
                            endRow: 0,
                          },
                        ],
                        mode: 'javascript',
                        file: 'top_editor.js',
                        tabName: 'JavaScript',
                        editorWindowId: 'Editor',
                        restrictCursorRow: true,
                        tabSelected: true,
                      },
                    ],
                  ],
                  previewWindowList: [
                    {
                      windowId: 'preview',
                      sizeAndPosition: {
                        top: '0%',
                        left: '0%',
                        width: '58%',
                        height: '100%',
                      },
                      file: 'lesson04-main.html',
                    },
                  ],
                  snap: 'lesson04-main',
                  validationFile: 'top_test.js',
                },
                {
                  elementName: 'FlipCardElement',
                  domId: 'lesson-hint',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      '7iTkECg94zRBYBrG1tr22VOTdhHStqforUPbcCwhd//sYyfNLVzgZoj6QytHvisp2ia+mNTaN3KQnhl+9giO5w==',
                  },
                  cardContentUrlList: [
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson04-main_1.html',
                  ],
                  flipButtonText: ['ヒントを見る', '次のヒント'],
                  sizeAndPosition: {
                    height: '40%',
                    width: '41%',
                    top: '0%',
                    left: '59%',
                  },
                  guideButtons: {
                    hintTalk: {
                      src: [
                        {
                          en: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/g_mickey_1_hint_006.mp3',
                          es: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/es/g_mickey_1_hint_006.mp3',
                        },
                      ],
                      className: 'hint-talk',
                      icon: 'volume-up',
                    },
                  },
                },
              ],
              enterBehaviourList: [],
              exitCondition: {
                type: 'AND',
                detailList: ['TalkFinish:mimil:default'],
              },
              exitBehaviourList: [],
              metaData: {
                stepId: 42,
                stepType: {
                  type: 'talk',
                  snapType: '',
                  layout: 'ERH1',
                  onlyMove: false,
                  talkId: 'default',
                  domId: 'mimil',
                },
                preloadUrlList: [
                  '/api/shared/mp3/talk/mickey/g_mickey_1/g_mickey_1_017.mp3',
                  '/api/shared/mp3/talk/mickey/g_mickey_1/es/g_mickey_1_017.mp3',
                ],
                customUpdateRuleList: [],
                uniqueId:
                  '7iTkECg94zRBYBrG1tr22VOTdhHStqforUPbcCwhd//sYyfNLVzgZoj6QytHvisp2ia+mNTaN3KQnhl+9giO5w==',
              },
            },
            {
              stepId: 43,
              bgm: {
                src: '/api/shared/mp3/BGM00_gemlesson.mp3',
              },
              defaultNextStepId: 44,
              elementList: [
                {
                  elementName: 'FlashElement',
                  domId: 'mimil',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      '4treTeXIEGoJ/WQF0rd63tKrVNTYaimYPKxTO5Lk69P3UYGkCPrOvmDdfc+mq2VzrH5VbK34iDm8ycD83IYiVA==',
                  },
                  flashName: 'mimil',
                  sizeAndPosition: {
                    left: '85%',
                    top: '50%',
                    width: null,
                    height: null,
                  },
                  isImage: false,
                  isDraggable: true,
                },
                {
                  elementName: 'DevelopWindowsElement',
                  domId: 'lesson-develop-windows',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      '4treTeXIEGoJ/WQF0rd63tKrVNTYaimYPKxTO5Lk69P3UYGkCPrOvmDdfc+mq2VzrH5VbK34iDm8ycD83IYiVA==',
                  },
                  editorWindowsList: [
                    [
                      {
                        windowId: 'Editor1',
                        sizeAndPosition: {
                          height: '58.5%',
                          width: '41%',
                          top: '41.5%',
                          left: '59%',
                        },
                        theme: 'chaos',
                        highlightCssClass: 'flash-dark',
                        onFocusCssClass: 'normal-highlight',
                        editAreaList: [
                          {
                            startRow: 0,
                            endRow: 0,
                          },
                        ],
                        mode: 'javascript',
                        file: 'top_editor.js',
                        tabName: 'JavaScript',
                        editorWindowId: 'Editor',
                        restrictCursorRow: true,
                        tabSelected: true,
                      },
                    ],
                  ],
                  previewWindowList: [
                    {
                      windowId: 'preview',
                      sizeAndPosition: {
                        top: '0%',
                        left: '0%',
                        width: '58%',
                        height: '100%',
                      },
                      file: 'lesson04-main.html',
                    },
                  ],
                  snap: 'lesson04-main',
                  validationFile: 'top_test.js',
                },
                {
                  elementName: 'FlipCardElement',
                  domId: 'lesson-hint',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      '4treTeXIEGoJ/WQF0rd63tKrVNTYaimYPKxTO5Lk69P3UYGkCPrOvmDdfc+mq2VzrH5VbK34iDm8ycD83IYiVA==',
                  },
                  cardContentUrlList: [
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson04-main_1.html',
                  ],
                  flipButtonText: ['ヒントを見る', '次のヒント'],
                  sizeAndPosition: {
                    height: '40%',
                    width: '41%',
                    top: '0%',
                    left: '59%',
                  },
                  guideButtons: {
                    hintTalk: {
                      src: [
                        {
                          en: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/g_mickey_1_hint_006.mp3',
                          es: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/es/g_mickey_1_hint_006.mp3',
                        },
                      ],
                      className: 'hint-talk',
                      icon: 'volume-up',
                    },
                  },
                },
                {
                  elementName: 'SlideElement',
                  domId: 'slide',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      '4treTeXIEGoJ/WQF0rd63tKrVNTYaimYPKxTO5Lk69P3UYGkCPrOvmDdfc+mq2VzrH5VbK34iDm8ycD83IYiVA==',
                  },
                  src: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/png/002.png',
                  zIndex: 25,
                  mask: 'transparent-black-mask',
                  sizeAndPosition: {
                    left: '50%',
                    top: '50%',
                    width: '900px',
                    height: '480px',
                    transform: 'translate(-50%, -50%)',
                  },
                  title: null,
                },
              ],
              enterBehaviourList: [],
              exitCondition: {
                type: 'AND',
                detailList: ['AnimationFinish:mimil'],
              },
              exitBehaviourList: [],
              metaData: {
                stepId: 43,
                stepType: {
                  type: 'talk',
                  slide: 'createImage',
                  snapType: '',
                  layout: 'ERH1',
                  onlyMove: true,
                },
                preloadUrlList: [
                  '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/png/002.png',
                ],
                customUpdateRuleList: [],
                stepLabel: '',
                lessonName: '',
                isLesson: false,
                uniqueId:
                  '4treTeXIEGoJ/WQF0rd63tKrVNTYaimYPKxTO5Lk69P3UYGkCPrOvmDdfc+mq2VzrH5VbK34iDm8ycD83IYiVA==',
              },
            },
            {
              stepId: 44,
              bgm: {
                src: '/api/shared/mp3/BGM00_gemlesson.mp3',
              },
              defaultNextStepId: 45,
              elementList: [
                {
                  elementName: 'FlashElement',
                  domId: 'mimil',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      '4treTeXIEGoJ/WQF0rd63tKrVNTYaimYPKxTO5Lk69P3UYGkCPrOvmDdfc+mq2VzrH5VbK34iDm8ycD83IYiVA==',
                  },
                  flashName: 'mimil',
                  sizeAndPosition: {
                    left: '85%',
                    top: '50%',
                    width: null,
                    height: null,
                  },
                  isImage: false,
                  isDraggable: true,
                  playSerifTalk: {
                    src: {
                      en: '/api/shared/mp3/talk/mickey/g_mickey_1/g_mickey_1_018.mp3',
                      es: '/api/shared/mp3/talk/mickey/g_mickey_1/es/g_mickey_1_018.mp3',
                    },
                  },
                  talkId: 'default',
                  talkDetail: {
                    textList: ['Let&#39;s review.'],
                    arrowDirection: 'right',
                  },
                },
                {
                  elementName: 'DevelopWindowsElement',
                  domId: 'lesson-develop-windows',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      '4treTeXIEGoJ/WQF0rd63tKrVNTYaimYPKxTO5Lk69P3UYGkCPrOvmDdfc+mq2VzrH5VbK34iDm8ycD83IYiVA==',
                  },
                  editorWindowsList: [
                    [
                      {
                        windowId: 'Editor1',
                        sizeAndPosition: {
                          height: '58.5%',
                          width: '41%',
                          top: '41.5%',
                          left: '59%',
                        },
                        theme: 'chaos',
                        highlightCssClass: 'flash-dark',
                        onFocusCssClass: 'normal-highlight',
                        editAreaList: [
                          {
                            startRow: 0,
                            endRow: 0,
                          },
                        ],
                        mode: 'javascript',
                        file: 'top_editor.js',
                        tabName: 'JavaScript',
                        editorWindowId: 'Editor',
                        restrictCursorRow: true,
                        tabSelected: true,
                      },
                    ],
                  ],
                  previewWindowList: [
                    {
                      windowId: 'preview',
                      sizeAndPosition: {
                        top: '0%',
                        left: '0%',
                        width: '58%',
                        height: '100%',
                      },
                      file: 'lesson04-main.html',
                    },
                  ],
                  snap: 'lesson04-main',
                  validationFile: 'top_test.js',
                },
                {
                  elementName: 'FlipCardElement',
                  domId: 'lesson-hint',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      '4treTeXIEGoJ/WQF0rd63tKrVNTYaimYPKxTO5Lk69P3UYGkCPrOvmDdfc+mq2VzrH5VbK34iDm8ycD83IYiVA==',
                  },
                  cardContentUrlList: [
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson04-main_1.html',
                  ],
                  flipButtonText: ['ヒントを見る', '次のヒント'],
                  sizeAndPosition: {
                    height: '40%',
                    width: '41%',
                    top: '0%',
                    left: '59%',
                  },
                  guideButtons: {
                    hintTalk: {
                      src: [
                        {
                          en: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/g_mickey_1_hint_006.mp3',
                          es: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/es/g_mickey_1_hint_006.mp3',
                        },
                      ],
                      className: 'hint-talk',
                      icon: 'volume-up',
                    },
                  },
                },
                {
                  elementName: 'SlideElement',
                  domId: 'slide',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      '4treTeXIEGoJ/WQF0rd63tKrVNTYaimYPKxTO5Lk69P3UYGkCPrOvmDdfc+mq2VzrH5VbK34iDm8ycD83IYiVA==',
                  },
                  src: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/png/002.png',
                  zIndex: 25,
                  mask: 'transparent-black-mask',
                  sizeAndPosition: {
                    left: '50%',
                    top: '50%',
                    width: '900px',
                    height: '480px',
                    transform: 'translate(-50%, -50%)',
                  },
                  title: null,
                },
              ],
              enterBehaviourList: [],
              exitCondition: {
                type: 'AND',
                detailList: ['TalkFinish:mimil:default'],
              },
              exitBehaviourList: [],
              metaData: {
                stepId: 44,
                stepType: {
                  type: 'talk',
                  snapType: '',
                  layout: 'ERH1',
                  onlyMove: false,
                  talkId: 'default',
                  domId: 'mimil',
                },
                preloadUrlList: [
                  '/api/shared/mp3/talk/mickey/g_mickey_1/g_mickey_1_018.mp3',
                  '/api/shared/mp3/talk/mickey/g_mickey_1/es/g_mickey_1_018.mp3',
                ],
                customUpdateRuleList: [],
                uniqueId:
                  '4treTeXIEGoJ/WQF0rd63tKrVNTYaimYPKxTO5Lk69P3UYGkCPrOvmDdfc+mq2VzrH5VbK34iDm8ycD83IYiVA==',
              },
            },
            {
              stepId: 45,
              bgm: {
                src: '/api/shared/mp3/BGM00_gemlesson.mp3',
              },
              defaultNextStepId: 46,
              elementList: [
                {
                  elementName: 'FlashElement',
                  domId: 'mimil',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'OBb6VYwVYv54JSnPDy1vsTn/+56VjJXdAYnJiDdnD0KUV17Xg9BGLhzrb56BxmNIHc0JfLy6OYdxxe1OziMR6Q==',
                  },
                  flashName: 'mimil',
                  sizeAndPosition: {
                    left: '85%',
                    top: '15%',
                    width: null,
                    height: null,
                  },
                  isImage: false,
                  isDraggable: true,
                },
                {
                  elementName: 'DevelopWindowsElement',
                  domId: 'lesson-develop-windows',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'OBb6VYwVYv54JSnPDy1vsTn/+56VjJXdAYnJiDdnD0KUV17Xg9BGLhzrb56BxmNIHc0JfLy6OYdxxe1OziMR6Q==',
                  },
                  editorWindowsList: [
                    [
                      {
                        windowId: 'Editor1',
                        sizeAndPosition: {
                          height: '58.5%',
                          width: '41%',
                          top: '41.5%',
                          left: '59%',
                        },
                        theme: 'chaos',
                        highlightCssClass: 'flash-dark',
                        onFocusCssClass: 'normal-highlight',
                        editAreaList: [
                          {
                            startRow: 0,
                            endRow: 0,
                          },
                        ],
                        mode: 'javascript',
                        file: 'top_editor.js',
                        tabName: 'JavaScript',
                        editorWindowId: 'Editor',
                        restrictCursorRow: true,
                        tabSelected: true,
                      },
                    ],
                  ],
                  previewWindowList: [
                    {
                      windowId: 'preview',
                      sizeAndPosition: {
                        top: '0%',
                        left: '0%',
                        width: '58%',
                        height: '100%',
                      },
                      file: 'lesson04-main.html',
                    },
                  ],
                  snap: 'lesson04-main',
                  validationFile: 'top_test.js',
                },
                {
                  elementName: 'FlipCardElement',
                  domId: 'lesson-hint',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'OBb6VYwVYv54JSnPDy1vsTn/+56VjJXdAYnJiDdnD0KUV17Xg9BGLhzrb56BxmNIHc0JfLy6OYdxxe1OziMR6Q==',
                  },
                  cardContentUrlList: [
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson04-main_1.html',
                  ],
                  flipButtonText: ['ヒントを見る', '次のヒント'],
                  sizeAndPosition: {
                    height: '40%',
                    width: '41%',
                    top: '0%',
                    left: '59%',
                  },
                  guideButtons: {
                    hintTalk: {
                      src: [
                        {
                          en: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/g_mickey_1_hint_006.mp3',
                          es: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/es/g_mickey_1_hint_006.mp3',
                        },
                      ],
                      className: 'hint-talk',
                      icon: 'volume-up',
                    },
                  },
                },
                {
                  elementName: 'SlideElement',
                  domId: 'slide',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'OBb6VYwVYv54JSnPDy1vsTn/+56VjJXdAYnJiDdnD0KUV17Xg9BGLhzrb56BxmNIHc0JfLy6OYdxxe1OziMR6Q==',
                  },
                  src: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/png/002.png',
                  zIndex: 25,
                  mask: 'transparent-black-mask',
                  sizeAndPosition: {
                    left: '50%',
                    top: '50%',
                    width: '900px',
                    height: '480px',
                    transform: 'translate(-50%, -50%)',
                  },
                  title: null,
                },
              ],
              enterBehaviourList: [],
              exitCondition: {
                type: 'AND',
                detailList: ['AnimationFinish:mimil'],
              },
              exitBehaviourList: [],
              metaData: {
                stepId: 45,
                stepType: {
                  type: 'talk',
                  snapType: '',
                  layout: 'ERH1',
                  onlyMove: true,
                },
                preloadUrlList: [],
                customUpdateRuleList: [],
                uniqueId:
                  'OBb6VYwVYv54JSnPDy1vsTn/+56VjJXdAYnJiDdnD0KUV17Xg9BGLhzrb56BxmNIHc0JfLy6OYdxxe1OziMR6Q==',
              },
            },
            {
              stepId: 46,
              bgm: {
                src: '/api/shared/mp3/BGM00_gemlesson.mp3',
              },
              defaultNextStepId: 47,
              elementList: [
                {
                  elementName: 'FlashElement',
                  domId: 'mimil',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'OBb6VYwVYv54JSnPDy1vsTn/+56VjJXdAYnJiDdnD0KUV17Xg9BGLhzrb56BxmNIHc0JfLy6OYdxxe1OziMR6Q==',
                  },
                  flashName: 'mimil',
                  sizeAndPosition: {
                    left: '85%',
                    top: '15%',
                    width: null,
                    height: null,
                  },
                  isImage: false,
                  isDraggable: true,
                  playSerifTalk: {
                    src: {
                      en: '/api/shared/mp3/talk/mickey/g_mickey_1/g_mickey_1_019.mp3',
                      es: '/api/shared/mp3/talk/mickey/g_mickey_1/es/g_mickey_1_019.mp3',
                    },
                  },
                  talkId: 'default',
                  talkDetail: {
                    textList: [
                      'When using ellipse, the first two numbers decide how far the circle is from the left and the top.',
                    ],
                    arrowDirection: 'right',
                  },
                },
                {
                  elementName: 'DevelopWindowsElement',
                  domId: 'lesson-develop-windows',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'OBb6VYwVYv54JSnPDy1vsTn/+56VjJXdAYnJiDdnD0KUV17Xg9BGLhzrb56BxmNIHc0JfLy6OYdxxe1OziMR6Q==',
                  },
                  editorWindowsList: [
                    [
                      {
                        windowId: 'Editor1',
                        sizeAndPosition: {
                          height: '58.5%',
                          width: '41%',
                          top: '41.5%',
                          left: '59%',
                        },
                        theme: 'chaos',
                        highlightCssClass: 'flash-dark',
                        onFocusCssClass: 'normal-highlight',
                        editAreaList: [
                          {
                            startRow: 0,
                            endRow: 0,
                          },
                        ],
                        mode: 'javascript',
                        file: 'top_editor.js',
                        tabName: 'JavaScript',
                        editorWindowId: 'Editor',
                        restrictCursorRow: true,
                        tabSelected: true,
                      },
                    ],
                  ],
                  previewWindowList: [
                    {
                      windowId: 'preview',
                      sizeAndPosition: {
                        top: '0%',
                        left: '0%',
                        width: '58%',
                        height: '100%',
                      },
                      file: 'lesson04-main.html',
                    },
                  ],
                  snap: 'lesson04-main',
                  validationFile: 'top_test.js',
                },
                {
                  elementName: 'FlipCardElement',
                  domId: 'lesson-hint',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'OBb6VYwVYv54JSnPDy1vsTn/+56VjJXdAYnJiDdnD0KUV17Xg9BGLhzrb56BxmNIHc0JfLy6OYdxxe1OziMR6Q==',
                  },
                  cardContentUrlList: [
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson04-main_1.html',
                  ],
                  flipButtonText: ['ヒントを見る', '次のヒント'],
                  sizeAndPosition: {
                    height: '40%',
                    width: '41%',
                    top: '0%',
                    left: '59%',
                  },
                  guideButtons: {
                    hintTalk: {
                      src: [
                        {
                          en: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/g_mickey_1_hint_006.mp3',
                          es: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/es/g_mickey_1_hint_006.mp3',
                        },
                      ],
                      className: 'hint-talk',
                      icon: 'volume-up',
                    },
                  },
                },
                {
                  elementName: 'SlideElement',
                  domId: 'slide',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'OBb6VYwVYv54JSnPDy1vsTn/+56VjJXdAYnJiDdnD0KUV17Xg9BGLhzrb56BxmNIHc0JfLy6OYdxxe1OziMR6Q==',
                  },
                  src: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/png/002.png',
                  zIndex: 25,
                  mask: 'transparent-black-mask',
                  sizeAndPosition: {
                    left: '50%',
                    top: '50%',
                    width: '900px',
                    height: '480px',
                    transform: 'translate(-50%, -50%)',
                  },
                  title: null,
                },
              ],
              enterBehaviourList: [],
              exitCondition: {
                type: 'AND',
                detailList: ['TalkFinish:mimil:default'],
              },
              exitBehaviourList: [],
              metaData: {
                stepId: 46,
                stepType: {
                  type: 'talk',
                  snapType: '',
                  layout: 'ERH1',
                  onlyMove: false,
                  talkId: 'default',
                  domId: 'mimil',
                },
                preloadUrlList: [
                  '/api/shared/mp3/talk/mickey/g_mickey_1/g_mickey_1_019.mp3',
                  '/api/shared/mp3/talk/mickey/g_mickey_1/es/g_mickey_1_019.mp3',
                ],
                customUpdateRuleList: [],
                uniqueId:
                  'OBb6VYwVYv54JSnPDy1vsTn/+56VjJXdAYnJiDdnD0KUV17Xg9BGLhzrb56BxmNIHc0JfLy6OYdxxe1OziMR6Q==',
              },
            },
            {
              stepId: 47,
              bgm: {
                src: '/api/shared/mp3/BGM00_gemlesson.mp3',
              },
              defaultNextStepId: 48,
              elementList: [
                {
                  elementName: 'FlashElement',
                  domId: 'mimil',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'JSIdNghC1foWEfR5SDcVIgZAXE8+7J0OcOlrQkqpVPhnuEuIHyo5vFZnKUCRQA7YC8NxW7UoNHiUavJ6Va8Zvg==',
                  },
                  flashName: 'mimil',
                  sizeAndPosition: {
                    left: '40%',
                    top: '45%',
                    width: null,
                    height: null,
                  },
                  isImage: false,
                  isDraggable: true,
                },
                {
                  elementName: 'DevelopWindowsElement',
                  domId: 'lesson-develop-windows',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'JSIdNghC1foWEfR5SDcVIgZAXE8+7J0OcOlrQkqpVPhnuEuIHyo5vFZnKUCRQA7YC8NxW7UoNHiUavJ6Va8Zvg==',
                  },
                  editorWindowsList: [
                    [
                      {
                        windowId: 'Editor1',
                        sizeAndPosition: {
                          height: '58.5%',
                          width: '41%',
                          top: '41.5%',
                          left: '59%',
                        },
                        theme: 'chaos',
                        highlightCssClass: 'flash-dark',
                        onFocusCssClass: 'normal-highlight',
                        editAreaList: [
                          {
                            startRow: 0,
                            endRow: 0,
                          },
                        ],
                        mode: 'javascript',
                        file: 'top_editor.js',
                        tabName: 'JavaScript',
                        editorWindowId: 'Editor',
                        restrictCursorRow: true,
                        tabSelected: true,
                      },
                    ],
                  ],
                  previewWindowList: [
                    {
                      windowId: 'preview',
                      sizeAndPosition: {
                        top: '0%',
                        left: '0%',
                        width: '58%',
                        height: '100%',
                      },
                      file: 'lesson04-main.html',
                    },
                  ],
                  snap: 'lesson04-main',
                  validationFile: 'top_test.js',
                },
                {
                  elementName: 'FlipCardElement',
                  domId: 'lesson-hint',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'JSIdNghC1foWEfR5SDcVIgZAXE8+7J0OcOlrQkqpVPhnuEuIHyo5vFZnKUCRQA7YC8NxW7UoNHiUavJ6Va8Zvg==',
                  },
                  cardContentUrlList: [
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson04-main_1.html',
                  ],
                  flipButtonText: ['ヒントを見る', '次のヒント'],
                  sizeAndPosition: {
                    height: '40%',
                    width: '41%',
                    top: '0%',
                    left: '59%',
                  },
                  guideButtons: {
                    hintTalk: {
                      src: [
                        {
                          en: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/g_mickey_1_hint_006.mp3',
                          es: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/es/g_mickey_1_hint_006.mp3',
                        },
                      ],
                      className: 'hint-talk',
                      icon: 'volume-up',
                    },
                  },
                },
                {
                  elementName: 'SlideElement',
                  domId: 'slide',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'JSIdNghC1foWEfR5SDcVIgZAXE8+7J0OcOlrQkqpVPhnuEuIHyo5vFZnKUCRQA7YC8NxW7UoNHiUavJ6Va8Zvg==',
                  },
                  src: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/png/002.png',
                  zIndex: 25,
                  mask: 'transparent-black-mask',
                  sizeAndPosition: {
                    left: '50%',
                    top: '50%',
                    width: '900px',
                    height: '480px',
                    transform: 'translate(-50%, -50%)',
                  },
                  title: null,
                },
              ],
              enterBehaviourList: [],
              exitCondition: {
                type: 'AND',
                detailList: ['AnimationFinish:mimil'],
              },
              exitBehaviourList: [],
              metaData: {
                stepId: 47,
                stepType: {
                  type: 'talk',
                  snapType: '',
                  layout: 'ERH1',
                  onlyMove: true,
                },
                preloadUrlList: [],
                customUpdateRuleList: [],
                uniqueId:
                  'JSIdNghC1foWEfR5SDcVIgZAXE8+7J0OcOlrQkqpVPhnuEuIHyo5vFZnKUCRQA7YC8NxW7UoNHiUavJ6Va8Zvg==',
              },
            },
            {
              stepId: 48,
              bgm: {
                src: '/api/shared/mp3/BGM00_gemlesson.mp3',
              },
              defaultNextStepId: 49,
              elementList: [
                {
                  elementName: 'FlashElement',
                  domId: 'mimil',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'JSIdNghC1foWEfR5SDcVIgZAXE8+7J0OcOlrQkqpVPhnuEuIHyo5vFZnKUCRQA7YC8NxW7UoNHiUavJ6Va8Zvg==',
                  },
                  flashName: 'mimil',
                  sizeAndPosition: {
                    left: '40%',
                    top: '45%',
                    width: null,
                    height: null,
                  },
                  isImage: false,
                  isDraggable: true,
                  playSerifTalk: {
                    src: {
                      en: '/api/shared/mp3/talk/mickey/g_mickey_1/g_mickey_1_020.mp3',
                      es: '/api/shared/mp3/talk/mickey/g_mickey_1/es/g_mickey_1_020.mp3',
                    },
                  },
                  talkId: 'default',
                  talkDetail: {
                    textList: [
                      'The last number decides how big the circle is. Excellent job! You&#39;re done with circle magic!',
                    ],
                    arrowDirection: 'left',
                  },
                },
                {
                  elementName: 'DevelopWindowsElement',
                  domId: 'lesson-develop-windows',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'JSIdNghC1foWEfR5SDcVIgZAXE8+7J0OcOlrQkqpVPhnuEuIHyo5vFZnKUCRQA7YC8NxW7UoNHiUavJ6Va8Zvg==',
                  },
                  editorWindowsList: [
                    [
                      {
                        windowId: 'Editor1',
                        sizeAndPosition: {
                          height: '58.5%',
                          width: '41%',
                          top: '41.5%',
                          left: '59%',
                        },
                        theme: 'chaos',
                        highlightCssClass: 'flash-dark',
                        onFocusCssClass: 'normal-highlight',
                        editAreaList: [
                          {
                            startRow: 0,
                            endRow: 0,
                          },
                        ],
                        mode: 'javascript',
                        file: 'top_editor.js',
                        tabName: 'JavaScript',
                        editorWindowId: 'Editor',
                        restrictCursorRow: true,
                        tabSelected: true,
                      },
                    ],
                  ],
                  previewWindowList: [
                    {
                      windowId: 'preview',
                      sizeAndPosition: {
                        top: '0%',
                        left: '0%',
                        width: '58%',
                        height: '100%',
                      },
                      file: 'lesson04-main.html',
                    },
                  ],
                  snap: 'lesson04-main',
                  validationFile: 'top_test.js',
                },
                {
                  elementName: 'FlipCardElement',
                  domId: 'lesson-hint',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'JSIdNghC1foWEfR5SDcVIgZAXE8+7J0OcOlrQkqpVPhnuEuIHyo5vFZnKUCRQA7YC8NxW7UoNHiUavJ6Va8Zvg==',
                  },
                  cardContentUrlList: [
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson04-main_1.html',
                  ],
                  flipButtonText: ['ヒントを見る', '次のヒント'],
                  sizeAndPosition: {
                    height: '40%',
                    width: '41%',
                    top: '0%',
                    left: '59%',
                  },
                  guideButtons: {
                    hintTalk: {
                      src: [
                        {
                          en: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/g_mickey_1_hint_006.mp3',
                          es: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/es/g_mickey_1_hint_006.mp3',
                        },
                      ],
                      className: 'hint-talk',
                      icon: 'volume-up',
                    },
                  },
                },
                {
                  elementName: 'SlideElement',
                  domId: 'slide',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'JSIdNghC1foWEfR5SDcVIgZAXE8+7J0OcOlrQkqpVPhnuEuIHyo5vFZnKUCRQA7YC8NxW7UoNHiUavJ6Va8Zvg==',
                  },
                  src: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/png/002.png',
                  zIndex: 25,
                  mask: 'transparent-black-mask',
                  sizeAndPosition: {
                    left: '50%',
                    top: '50%',
                    width: '900px',
                    height: '480px',
                    transform: 'translate(-50%, -50%)',
                  },
                  title: null,
                },
              ],
              enterBehaviourList: [],
              exitCondition: {
                type: 'AND',
                detailList: ['TalkFinish:mimil:default'],
              },
              exitBehaviourList: [],
              metaData: {
                stepId: 48,
                stepType: {
                  type: 'talk',
                  snapType: '',
                  layout: 'ERH1',
                  onlyMove: false,
                  talkId: 'default',
                  domId: 'mimil',
                },
                preloadUrlList: [
                  '/api/shared/mp3/talk/mickey/g_mickey_1/g_mickey_1_020.mp3',
                  '/api/shared/mp3/talk/mickey/g_mickey_1/es/g_mickey_1_020.mp3',
                ],
                customUpdateRuleList: [],
                uniqueId:
                  'JSIdNghC1foWEfR5SDcVIgZAXE8+7J0OcOlrQkqpVPhnuEuIHyo5vFZnKUCRQA7YC8NxW7UoNHiUavJ6Va8Zvg==',
              },
            },
            {
              stepId: 49,
              bgm: null,
              defaultNextStepId: 50,
              elementList: [
                {
                  elementName: 'FlashElement',
                  domId: 'mimil',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'ckdK7HNCMRCqUz4XsDNVFoLxdGtLIMRAtBWCBKQN6wFO6mbCj/3CQLpL5ZtTyAJCrhmorAQz3zBXfFdGCgbGeQ==',
                  },
                  flashName: 'mimil',
                  sizeAndPosition: {
                    left: '40%',
                    top: '45%',
                    width: null,
                    height: null,
                  },
                  isImage: false,
                  isDraggable: true,
                },
                {
                  elementName: 'DevelopWindowsElement',
                  domId: 'lesson-develop-windows',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'ckdK7HNCMRCqUz4XsDNVFoLxdGtLIMRAtBWCBKQN6wFO6mbCj/3CQLpL5ZtTyAJCrhmorAQz3zBXfFdGCgbGeQ==',
                  },
                  editorWindowsList: [
                    [
                      {
                        windowId: 'Editor1',
                        sizeAndPosition: {
                          height: '58.5%',
                          width: '41%',
                          top: '41.5%',
                          left: '59%',
                        },
                        theme: 'chaos',
                        highlightCssClass: 'flash-dark',
                        onFocusCssClass: 'normal-highlight',
                        editAreaList: [
                          {
                            startRow: 0,
                            endRow: 0,
                          },
                        ],
                        mode: 'javascript',
                        file: 'top_editor.js',
                        tabName: 'JavaScript',
                        editorWindowId: 'Editor',
                        restrictCursorRow: true,
                        tabSelected: true,
                      },
                    ],
                  ],
                  previewWindowList: [
                    {
                      windowId: 'preview',
                      sizeAndPosition: {
                        top: '0%',
                        left: '0%',
                        width: '58%',
                        height: '100%',
                      },
                      file: 'lesson04-main.html',
                    },
                  ],
                  snap: 'lesson04-main',
                  validationFile: 'top_test.js',
                },
                {
                  elementName: 'FlipCardElement',
                  domId: 'lesson-hint',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'ckdK7HNCMRCqUz4XsDNVFoLxdGtLIMRAtBWCBKQN6wFO6mbCj/3CQLpL5ZtTyAJCrhmorAQz3zBXfFdGCgbGeQ==',
                  },
                  cardContentUrlList: [
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson04-main_1.html',
                  ],
                  flipButtonText: ['ヒントを見る', '次のヒント'],
                  sizeAndPosition: {
                    height: '40%',
                    width: '41%',
                    top: '0%',
                    left: '59%',
                  },
                  guideButtons: {
                    hintTalk: {
                      src: [
                        {
                          en: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/g_mickey_1_hint_006.mp3',
                          es: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/es/g_mickey_1_hint_006.mp3',
                        },
                      ],
                      className: 'hint-talk',
                      icon: 'volume-up',
                    },
                  },
                },
              ],
              enterBehaviourList: [],
              exitCondition: {},
              exitBehaviourList: [
                {
                  condition: {
                    type: 'AND',
                    detailList: [],
                  },
                  behaviourDetail: {
                    clearPoint: {
                      type: 'ASK',
                      value: 'end',
                    },
                  },
                },
              ],
              metaData: {
                stepId: 49,
                stepType: {
                  type: 'code',
                  slide: 'destroy',
                  snapType: '',
                  layout: 'ERH1',
                  code: 'stopBgm',
                },
                preloadUrlList: [],
                customUpdateRuleList: [],
                uniqueId:
                  'ckdK7HNCMRCqUz4XsDNVFoLxdGtLIMRAtBWCBKQN6wFO6mbCj/3CQLpL5ZtTyAJCrhmorAQz3zBXfFdGCgbGeQ==',
              },
            },
            {
              stepId: 50,
              defaultNextStepId: 51,
              elementList: [
                {
                  elementName: 'FlashElement',
                  domId: 'mimil',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'UPNpwp201DvBTpoDckpgfxcIZaWCI12FjGF/5Rup1CivW9ZlzRUQrMdJujEQw4qzQrUZbEYGaTDJCStjW7iBUg==',
                  },
                  flashName: 'mimil',
                  sizeAndPosition: {
                    left: '40%',
                    top: '45%',
                    width: null,
                    height: null,
                  },
                  isImage: false,
                  isDraggable: true,
                },
                {
                  elementName: 'DevelopWindowsElement',
                  domId: 'lesson-develop-windows',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'UPNpwp201DvBTpoDckpgfxcIZaWCI12FjGF/5Rup1CivW9ZlzRUQrMdJujEQw4qzQrUZbEYGaTDJCStjW7iBUg==',
                  },
                  editorWindowsList: [
                    [
                      {
                        windowId: 'Editor1',
                        sizeAndPosition: {
                          height: '58.5%',
                          width: '41%',
                          top: '41.5%',
                          left: '59%',
                        },
                        theme: 'chaos',
                        highlightCssClass: 'flash-dark',
                        onFocusCssClass: 'normal-highlight',
                        editAreaList: [
                          {
                            startRow: 0,
                            endRow: 0,
                          },
                        ],
                        mode: 'javascript',
                        file: 'top_editor.js',
                        tabName: 'JavaScript',
                        editorWindowId: 'Editor',
                        restrictCursorRow: true,
                        tabSelected: true,
                      },
                    ],
                  ],
                  previewWindowList: [
                    {
                      windowId: 'preview',
                      sizeAndPosition: {
                        top: '0%',
                        left: '0%',
                        width: '58%',
                        height: '100%',
                      },
                      file: 'lesson04-main.html',
                    },
                  ],
                  snap: 'lesson04-main',
                  validationFile: 'top_test.js',
                },
                {
                  elementName: 'FlipCardElement',
                  domId: 'lesson-hint',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'UPNpwp201DvBTpoDckpgfxcIZaWCI12FjGF/5Rup1CivW9ZlzRUQrMdJujEQw4qzQrUZbEYGaTDJCStjW7iBUg==',
                  },
                  cardContentUrlList: [
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson04-main_1.html',
                  ],
                  flipButtonText: ['ヒントを見る', '次のヒント'],
                  sizeAndPosition: {
                    height: '40%',
                    width: '41%',
                    top: '0%',
                    left: '59%',
                  },
                  guideButtons: {
                    hintTalk: {
                      src: [
                        {
                          en: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/g_mickey_1_hint_006.mp3',
                          es: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/es/g_mickey_1_hint_006.mp3',
                        },
                      ],
                      className: 'hint-talk',
                      icon: 'volume-up',
                    },
                  },
                },
                {
                  elementName: 'FlashElement',
                  domId: 'lc_anime_all',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'UPNpwp201DvBTpoDckpgfxcIZaWCI12FjGF/5Rup1CivW9ZlzRUQrMdJujEQw4qzQrUZbEYGaTDJCStjW7iBUg==',
                  },
                  flashName: 'lc_anime_all',
                  sizeAndPosition: {
                    left: '50%',
                    top: '50%',
                    width: '950px',
                    height: '590px',
                    transform: 'translate(-50%, -50%)',
                  },
                  isImage: false,
                  isDraggable: false,
                  zIndex: 451,
                  timeoutTime: 8000,
                  withTimeoutEvent: {
                    type: 'get_exp',
                    value: 'lc_anime_all',
                  },
                },
                {
                  elementName: 'MaskElement',
                  domId: 'mask',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                    stepUniqueId:
                      'UPNpwp201DvBTpoDckpgfxcIZaWCI12FjGF/5Rup1CivW9ZlzRUQrMdJujEQw4qzQrUZbEYGaTDJCStjW7iBUg==',
                  },
                  zIndex: 450,
                },
              ],
              enterBehaviourList: [],
              exitCondition: {
                type: 'AND',
                detailList: ['get_exp:guard'],
              },
              exitBehaviourList: [],
              metaData: {
                stepId: 50,
                stepType: {
                  type: 'code',
                  snapType: '',
                  layout: 'ERH1',
                  code: 'lessonCleared',
                  notProgressJump: true,
                },
                preloadUrlList: ['/api/shared/mp3/lesson_clear.mp3'],
                customUpdateRuleList: [],
                stepLabel: 'lesson_cleared',
                uniqueId:
                  'UPNpwp201DvBTpoDckpgfxcIZaWCI12FjGF/5Rup1CivW9ZlzRUQrMdJujEQw4qzQrUZbEYGaTDJCStjW7iBUg==',
              },
              se: {
                src: '/api/shared/mp3/lesson_clear.mp3',
              },
            },
            {
              stepId: 51,
              bgm: null,
              defaultNextStepId: 52,
              elementList: [
                {
                  elementName: 'FlashElement',
                  domId: 'mimil',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                  },
                  flashName: 'mimil',
                  sizeAndPosition: {
                    left: '40%',
                    top: '45%',
                    width: null,
                    height: null,
                  },
                  isImage: false,
                  isDraggable: true,
                },
                {
                  elementName: 'DevelopWindowsElement',
                  domId: 'lesson-develop-windows',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                  },
                  editorWindowsList: [
                    [
                      {
                        windowId: 'Editor1',
                        sizeAndPosition: {
                          height: '58.5%',
                          width: '41%',
                          top: '41.5%',
                          left: '59%',
                        },
                        theme: 'chaos',
                        highlightCssClass: 'flash-dark',
                        onFocusCssClass: 'normal-highlight',
                        editAreaList: [
                          {
                            startRow: 0,
                            endRow: 0,
                          },
                        ],
                        mode: 'javascript',
                        file: 'top_editor.js',
                        tabName: 'JavaScript',
                        editorWindowId: 'Editor',
                        restrictCursorRow: true,
                        tabSelected: true,
                      },
                    ],
                  ],
                  previewWindowList: [
                    {
                      windowId: 'preview',
                      sizeAndPosition: {
                        top: '0%',
                        left: '0%',
                        width: '58%',
                        height: '100%',
                      },
                      file: 'lesson04-main.html',
                    },
                  ],
                  snap: 'lesson04-main',
                  validationFile: 'top_test.js',
                },
                {
                  elementName: 'FlipCardElement',
                  domId: 'lesson-hint',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                  },
                  cardContentUrlList: [
                    '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/iframe/hint_lesson04-main_1.html',
                  ],
                  flipButtonText: ['ヒントを見る', '次のヒント'],
                  sizeAndPosition: {
                    height: '40%',
                    width: '41%',
                    top: '0%',
                    left: '59%',
                  },
                  guideButtons: {
                    hintTalk: {
                      src: [
                        {
                          en: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/g_mickey_1_hint_006.mp3',
                          es: '/api/projects/__PROJECT_NAME__/__SCENARIO_NAME__/mp3/hint/es/g_mickey_1_hint_006.mp3',
                        },
                      ],
                      className: 'hint-talk',
                      icon: 'volume-up',
                    },
                  },
                },
                {
                  elementName: 'FlashElement',
                  domId: 'lc_anime_all',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                  },
                  flashName: 'lc_anime_all',
                  sizeAndPosition: {
                    left: '50%',
                    top: '50%',
                    width: '950px',
                    height: '590px',
                    transform: 'translate(-50%, -50%)',
                  },
                  isImage: false,
                  isDraggable: false,
                  zIndex: 451,
                  timeoutTime: 8000,
                  withTimeoutEvent: {
                    type: 'get_exp',
                    value: 'lc_anime_all',
                  },
                },
                {
                  elementName: 'MaskElement',
                  domId: 'mask',
                  visible: true,
                  metaData: {
                    timeStamp: 0,
                  },
                  zIndex: 450,
                },
              ],
              enterBehaviourList: [],
              exitCondition: {
                type: 'AND',
                detailList: ['__LAST_STEP__'],
              },
              exitBehaviourList: [
                {
                  condition: {
                    type: 'AND',
                    detailList: [],
                  },
                  behaviourDetail: {
                    clearPoint: {
                      type: 'ASK',
                      value: 'end',
                    },
                  },
                },
              ],
              metaData: {
                stepId: 51,
                stepType: {
                  type: '',
                },
                preloadUrlList: [],
                customUpdateRuleList: [],
              },
            },
          ],
          metaData: {
            screenLayout: 'lesson',
            bgm: null,
            projectName: 'mickey',
            scenarioPath: 'lesson/g_mickey_1',
            preloadUrlList: [
              '/api/shared/js/flash_element/mimil.js',
              '/api/shared/js/flash_element/lc_anime_all.js',
            ],
            lessonStepMetaDataList: [
              [
                {
                  stepId: 18,
                  stepType: {
                    type: 'lesson',
                    snapType: 'begin',
                    layout: 'ERH1',
                  },
                  stepLabel: '',
                  lessonName: 'Create a circle',
                  isLesson: true,
                  uniqueId:
                    'mg6akQ5VS+48nBPD11XiU//0/XixNkOkPtiT9qRAhb84eeNelUQPMqqnRVLvpmkTAF4/VN69cCQ3GrFyztPqvA==',
                },
                {
                  stepId: 19,
                  stepType: {
                    type: 'talk',
                    snapType: 'begin',
                    layout: 'ERH1',
                    onlyMove: false,
                    talkId: 'default',
                    domId: 'mimil',
                  },
                  uniqueId:
                    'L1cNu3w+q6qexiHAeCj8sde3ZbkGteo0sGBqHdxfZMUsj9SYM274j8a49xVz7tV/x60xzTV8tEQHnFk/eOJgqg==',
                },
                {
                  stepId: 20,
                  stepType: {
                    type: 'talk',
                    snapType: 'begin',
                    layout: 'ERH1',
                    onlyMove: true,
                  },
                  uniqueId:
                    'F260cC0YTYx78h2oOwsUuNEIaq6FIj9iVYsjnQhTl0QAesxzx5JS9jiFFshLsezAsp7xbREr9V2ixi68lDdekg==',
                },
                {
                  stepId: 21,
                  stepType: {
                    type: 'talk',
                    snapType: 'begin',
                    layout: 'ERH1',
                    onlyMove: false,
                    talkId: 'default',
                    domId: 'mimil',
                  },
                  uniqueId:
                    'F260cC0YTYx78h2oOwsUuNEIaq6FIj9iVYsjnQhTl0QAesxzx5JS9jiFFshLsezAsp7xbREr9V2ixi68lDdekg==',
                },
                {
                  stepId: 22,
                  stepType: {
                    type: 'lesson',
                    snapType: '',
                    layout: 'ERH1',
                  },
                  uniqueId:
                    '19eDjJfCXt95SNNzhnAtT3R8KRMcoWSTh51JkN1glC3H3v2NxuZ6/2fPrJhmlbJQ1pLUuWVhtOWuLoGoaKe1zQ==',
                },
                {
                  stepId: 23,
                  stepType: {
                    type: 'talk',
                    snapType: '',
                    layout: 'ERH1',
                    onlyMove: true,
                  },
                  uniqueId:
                    'hjhIM6vHNPd1hVA7RaBlWr/y9wUjoU91Nd7SBh2UGD3f8lWJCLptifOcgPqVSfUPEHjkhQ4DxlGmxvK6UK094g==',
                },
                {
                  stepId: 24,
                  stepType: {
                    type: 'talk',
                    snapType: '',
                    layout: 'ERH1',
                    onlyMove: false,
                    talkId: 'default',
                    domId: 'mimil',
                  },
                  uniqueId:
                    'hjhIM6vHNPd1hVA7RaBlWr/y9wUjoU91Nd7SBh2UGD3f8lWJCLptifOcgPqVSfUPEHjkhQ4DxlGmxvK6UK094g==',
                },
                {
                  stepId: 25,
                  stepType: {
                    type: 'talk',
                    snapType: '',
                    layout: 'ERH1',
                    onlyMove: true,
                  },
                  uniqueId:
                    'BUgqwOVsmECfdgCGaIb3RalqhAqlQ9iZkxNEAmLK1otKxPF4On9no0huDVUfqi1+ty5cM5T1onhIhrOdkc9y2Q==',
                },
                {
                  stepId: 26,
                  stepType: {
                    type: 'talk',
                    snapType: '',
                    layout: 'ERH1',
                    onlyMove: false,
                    talkId: 'default',
                    domId: 'mimil',
                  },
                  uniqueId:
                    'BUgqwOVsmECfdgCGaIb3RalqhAqlQ9iZkxNEAmLK1otKxPF4On9no0huDVUfqi1+ty5cM5T1onhIhrOdkc9y2Q==',
                },
                {
                  stepId: 27,
                  stepType: {
                    type: 'talk',
                    snapType: '',
                    layout: 'ERH1',
                    onlyMove: true,
                  },
                  uniqueId:
                    'qOw2itRHesdn6FzBZzUTgcugpcVx/iT7iQKPTlfAVmCpQNQ53priGvYPI7kCo+NMzE/6l4MQWEa2yhdw198K+Q==',
                },
              ],
              [
                {
                  stepId: 28,
                  stepType: {
                    type: 'lesson',
                    snapType: '',
                    layout: 'ERH1',
                  },
                  stepLabel: '',
                  lessonName: 'Change the numbers within ellipse (1)',
                  isLesson: true,
                  uniqueId:
                    '8+3dSFduwcWkQvQxkXqgkHfAxBdXj4OnzN07zhZ56p9zbSpS5YZrDqjIBCry0YArmxIV72bkH215IBFjd91EJw==',
                },
                {
                  stepId: 29,
                  stepType: {
                    type: 'talk',
                    snapType: '',
                    layout: 'ERH1',
                    onlyMove: true,
                  },
                  uniqueId:
                    'IHVUxXDqpH7YHJEJ4yu+0rjZv245CQ97cuEVzKjsIIQTkkmd7W5iZpoGUCJ+l2WUw5yB6xWcBi0a6PK1yNqVmQ==',
                },
                {
                  stepId: 30,
                  stepType: {
                    type: 'talk',
                    snapType: '',
                    layout: 'ERH1',
                    onlyMove: false,
                    talkId: 'default',
                    domId: 'mimil',
                  },
                  uniqueId:
                    'IHVUxXDqpH7YHJEJ4yu+0rjZv245CQ97cuEVzKjsIIQTkkmd7W5iZpoGUCJ+l2WUw5yB6xWcBi0a6PK1yNqVmQ==',
                },
                {
                  stepId: 31,
                  stepType: {
                    type: 'talk',
                    snapType: '',
                    layout: 'ERH1',
                    onlyMove: true,
                  },
                  uniqueId:
                    'AWh3LE87WzNkW8rFkeu1yNAno8sqhL+VdoEXN940GY2wXFxpec+jUHm3WEsTXQmPJp6W7JQrwaywDTrTFQcGAQ==',
                },
                {
                  stepId: 32,
                  stepType: {
                    type: 'talk',
                    snapType: '',
                    layout: 'ERH1',
                    onlyMove: false,
                    talkId: 'default',
                    domId: 'mimil',
                  },
                  uniqueId:
                    'AWh3LE87WzNkW8rFkeu1yNAno8sqhL+VdoEXN940GY2wXFxpec+jUHm3WEsTXQmPJp6W7JQrwaywDTrTFQcGAQ==',
                },
                {
                  stepId: 33,
                  stepType: {
                    type: 'talk',
                    snapType: '',
                    layout: 'ERH1',
                    onlyMove: true,
                  },
                  uniqueId:
                    'frZtvTiOqUEUUbtCPwp1z8gYkODS9N1a/rDvLIS40Hmf+hywjLWnRMltWJ7kBaNwMpXLbY487XfWksn02pJrtQ==',
                },
              ],
              [
                {
                  stepId: 34,
                  stepType: {
                    type: 'lesson',
                    snapType: '',
                    layout: 'ERH1',
                  },
                  lessonName: 'Change the numbers within ellipse (2)',
                  isLesson: true,
                  uniqueId:
                    'pGHlZ5urAf8QGoKKu5FEnWRXldN5RzWlXe1cUPIj05hg387LUGjXQa0PPz+mcZTYUV8raqFxfExsijeu0eRo+A==',
                },
                {
                  stepId: 35,
                  stepType: {
                    type: 'talk',
                    snapType: '',
                    layout: 'ERH1',
                    onlyMove: true,
                  },
                  uniqueId:
                    'DAR0KcbenA0k43lqllTahhBwsG81AWKnLUKrGRtilo2gXTNSbh5oTWOF4KIcDCBCqP6zwLPPQYSDEY+Jl7EuBg==',
                },
                {
                  stepId: 36,
                  stepType: {
                    type: 'talk',
                    snapType: '',
                    layout: 'ERH1',
                    onlyMove: false,
                    talkId: 'default',
                    domId: 'mimil',
                  },
                  uniqueId:
                    'DAR0KcbenA0k43lqllTahhBwsG81AWKnLUKrGRtilo2gXTNSbh5oTWOF4KIcDCBCqP6zwLPPQYSDEY+Jl7EuBg==',
                },
                {
                  stepId: 37,
                  stepType: {
                    type: 'talk',
                    snapType: '',
                    layout: 'ERH1',
                    onlyMove: true,
                  },
                  uniqueId:
                    'HeQwDjHb2eORQQgbke1tw7vOjwg1+87Tp7CT/bd++AGvSvmhWk/gIU9Ywy6ckzjpiCEC4MQDXHnWadyJb0CDAw==',
                },
                {
                  stepId: 38,
                  stepType: {
                    type: 'talk',
                    snapType: '',
                    layout: 'ERH1',
                    onlyMove: false,
                    talkId: 'default',
                    domId: 'mimil',
                  },
                  uniqueId:
                    'HeQwDjHb2eORQQgbke1tw7vOjwg1+87Tp7CT/bd++AGvSvmhWk/gIU9Ywy6ckzjpiCEC4MQDXHnWadyJb0CDAw==',
                },
                {
                  stepId: 39,
                  stepType: {
                    type: 'talk',
                    snapType: '',
                    layout: 'ERH1',
                    onlyMove: true,
                  },
                  uniqueId:
                    'd+j/XqQX6+YSKf1ZfRFWZ/i5XrnvFFbewATii/opd8m+lvPY2wG/4BIWdMUoLfv5IRPLEXP1lFeEbMPao1pjYQ==',
                },
              ],
              [
                {
                  stepId: 40,
                  stepType: {
                    type: 'lesson',
                    snapType: '',
                    layout: 'ERH1',
                  },
                  lessonName: 'Change the numbers within ellipse (3)',
                  isLesson: true,
                  uniqueId:
                    'CRaKkWRsCqscwPx9ye/Foh6t1y7L+DJqC9OdJThUu1d0NcQWyOhSH0YE6yyW51vnHKWnn+QnCJRa/cD5IGrlBA==',
                },
                {
                  stepId: 41,
                  stepType: {
                    type: 'talk',
                    snapType: '',
                    layout: 'ERH1',
                    onlyMove: true,
                  },
                  uniqueId:
                    '7iTkECg94zRBYBrG1tr22VOTdhHStqforUPbcCwhd//sYyfNLVzgZoj6QytHvisp2ia+mNTaN3KQnhl+9giO5w==',
                },
                {
                  stepId: 42,
                  stepType: {
                    type: 'talk',
                    snapType: '',
                    layout: 'ERH1',
                    onlyMove: false,
                    talkId: 'default',
                    domId: 'mimil',
                  },
                  uniqueId:
                    '7iTkECg94zRBYBrG1tr22VOTdhHStqforUPbcCwhd//sYyfNLVzgZoj6QytHvisp2ia+mNTaN3KQnhl+9giO5w==',
                },
                {
                  stepId: 43,
                  stepType: {
                    type: 'talk',
                    slide: 'createImage',
                    snapType: '',
                    layout: 'ERH1',
                    onlyMove: true,
                  },
                  stepLabel: '',
                  lessonName: '',
                  isLesson: false,
                  uniqueId:
                    '4treTeXIEGoJ/WQF0rd63tKrVNTYaimYPKxTO5Lk69P3UYGkCPrOvmDdfc+mq2VzrH5VbK34iDm8ycD83IYiVA==',
                },
                {
                  stepId: 44,
                  stepType: {
                    type: 'talk',
                    snapType: '',
                    layout: 'ERH1',
                    onlyMove: false,
                    talkId: 'default',
                    domId: 'mimil',
                  },
                  uniqueId:
                    '4treTeXIEGoJ/WQF0rd63tKrVNTYaimYPKxTO5Lk69P3UYGkCPrOvmDdfc+mq2VzrH5VbK34iDm8ycD83IYiVA==',
                },
                {
                  stepId: 45,
                  stepType: {
                    type: 'talk',
                    snapType: '',
                    layout: 'ERH1',
                    onlyMove: true,
                  },
                  uniqueId:
                    'OBb6VYwVYv54JSnPDy1vsTn/+56VjJXdAYnJiDdnD0KUV17Xg9BGLhzrb56BxmNIHc0JfLy6OYdxxe1OziMR6Q==',
                },
                {
                  stepId: 46,
                  stepType: {
                    type: 'talk',
                    snapType: '',
                    layout: 'ERH1',
                    onlyMove: false,
                    talkId: 'default',
                    domId: 'mimil',
                  },
                  uniqueId:
                    'OBb6VYwVYv54JSnPDy1vsTn/+56VjJXdAYnJiDdnD0KUV17Xg9BGLhzrb56BxmNIHc0JfLy6OYdxxe1OziMR6Q==',
                },
                {
                  stepId: 47,
                  stepType: {
                    type: 'talk',
                    snapType: '',
                    layout: 'ERH1',
                    onlyMove: true,
                  },
                  uniqueId:
                    'JSIdNghC1foWEfR5SDcVIgZAXE8+7J0OcOlrQkqpVPhnuEuIHyo5vFZnKUCRQA7YC8NxW7UoNHiUavJ6Va8Zvg==',
                },
                {
                  stepId: 48,
                  stepType: {
                    type: 'talk',
                    snapType: '',
                    layout: 'ERH1',
                    onlyMove: false,
                    talkId: 'default',
                    domId: 'mimil',
                  },
                  uniqueId:
                    'JSIdNghC1foWEfR5SDcVIgZAXE8+7J0OcOlrQkqpVPhnuEuIHyo5vFZnKUCRQA7YC8NxW7UoNHiUavJ6Va8Zvg==',
                },
                {
                  stepId: 49,
                  stepType: {
                    type: 'code',
                    slide: 'destroy',
                    snapType: '',
                    layout: 'ERH1',
                    code: 'stopBgm',
                  },
                  uniqueId:
                    'ckdK7HNCMRCqUz4XsDNVFoLxdGtLIMRAtBWCBKQN6wFO6mbCj/3CQLpL5ZtTyAJCrhmorAQz3zBXfFdGCgbGeQ==',
                },
              ],
            ],
            customUpdateRuleList: [],
            episodeTitle: 'Basics of Media Art',
            chapterTitle: 'Circle Magic',
            courseTitle: 'テクノロジア魔法学校',
            disableSidebar: false,
            enableProgressBar: false,
          },
        },

        options: {
          host: '<シナリオ変換の際に送信したホスト>',
          port: '<シナリオ変換の際に送信したポート>',
          project_name: '<各シナリオシートのC2に記載されているプロジェクト名>',
          scenario_name: '<各シナリオシートのC3に記載されているシナリオ名>',
          screen_layout: 'lesson',
          sheet: '<各シナリオシートのシート名>',
          sheet_key: '<スプレッドシートのkey>',
          is_serif_only: '<セリフのみ変換を選択した場合に入る>',
          send_hook_url: '<シナリオ変換後に叩いたURL>',
        },
      },
      {},
    )
  })
})
