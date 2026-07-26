import type { ToolConfig } from './types';
import { config as mortgageCalculatorConfig } from './mortgage-calculator/config';
import { config as salesTaxCalculatorConfig } from './sales-tax-calculator/config';
import { config as vatCalculatorConfig } from './vat-calculator/config';
import { config as salaryCalculatorConfig } from './salary-calculator/config';
import { config as roiCalculatorConfig } from './roi-calculator/config';
import { config as breakEvenCalculatorConfig } from './break-even-calculator/config';
import { config as savingsGoalCalculatorConfig } from './savings-goal-calculator/config';
import { config as retirementCalculatorConfig } from './retirement-calculator/config';
import { config as inflationCalculatorConfig } from './inflation-calculator/config';
import { config as tdeeCalculatorConfig } from './tdee-calculator/config';
import { config as calorieCalculatorConfig } from './calorie-calculator/config';
import { config as pregnancyDueDateCalculatorConfig } from './pregnancy-due-date-calculator/config';
import { config as bodyFatCalculatorConfig } from './body-fat-calculator/config';
import { config as wavToMp3Config } from './wav-to-mp3/config';
import { config as flacToMp3Config } from './flac-to-mp3/config';
import { config as oggToMp3Config } from './ogg-to-mp3/config';
import { config as mp3ToWavConfig } from './mp3-to-wav/config';
import { config as m4aToWavConfig } from './m4a-to-wav/config';
import { config as wavToFlacConfig } from './wav-to-flac/config';
import { config as videoToMp3Config } from './video-to-mp3/config';
import { config as pngToJpgConfig } from './png-to-jpg/config';
import { config as jpgToPngConfig } from './jpg-to-png/config';
import { config as webpToJpgConfig } from './webp-to-jpg/config';
import { config as webpToPngConfig } from './webp-to-png/config';
import { config as pngToWebpConfig } from './png-to-webp/config';
import { config as jpgToWebpConfig } from './jpg-to-webp/config';
import { config as movToMp4Config } from './mov-to-mp4/config';
import { config as mkvToMp4Config } from './mkv-to-mp4/config';
import { config as webmToMp4Config } from './webm-to-mp4/config';
import { config as aviToMp4Config } from './avi-to-mp4/config';
import { config as mp4ToWebmConfig } from './mp4-to-webm/config';
import { config as mp4ToMovConfig } from './mp4-to-mov/config';
import { config as keyboardTestConfig } from './keyboard-test/config';
import { config as mouseTestConfig } from './mouse-test/config';
import { config as deadPixelTestConfig } from './dead-pixel-test/config';
import { config as webcamTestConfig } from './webcam-test/config';
import { config as metronomeConfig } from './metronome/config';
import { config as whiteNoiseGeneratorConfig } from './white-noise-generator/config';
import { config as vocalRemoverConfig } from './vocal-remover/config';
import { config as tunerConfig } from './tuner/config';
import { config as signatureMakerConfig } from './signature-maker/config';

import { config as wordCounterConfig } from './word-counter/config';
import { config as caseConverterConfig } from './case-converter/config';
import { config as slugGeneratorConfig } from './slug-generator/config';
import { config as jsonFormatterConfig } from './json-formatter/config';
import { config as base64Config } from './base64/config';
import { config as urlEncoderConfig } from './url-encoder/config';
import { config as uuidGeneratorConfig } from './uuid-generator/config';
import { config as regexTesterConfig } from './regex-tester/config';
import { config as jwtDecoderConfig } from './jwt-decoder/config';
import { config as metaTagGeneratorConfig } from './meta-tag-generator/config';
import { config as robotsTxtGeneratorConfig } from './robots-txt-generator/config';
import { config as sitemapGeneratorConfig } from './sitemap-generator/config';
import { config as dnsLookupConfig } from './dns-lookup/config';
import { config as serpPreviewConfig } from './serp-preview/config';
import { config as schemaGeneratorConfig } from './schema-generator/config';
import { config as imageCompressorConfig } from './image-compressor/config';
import { config as imageConverterConfig } from './image-converter/config';
import { config as imageBackgroundRemoverConfig } from './image-background-remover/config';
import { config as imageResizeCropConfig } from './image-resize-crop/config';
import { config as imageWatermarkConfig } from './image-watermark/config';
import { config as imageCollageConfig } from './image-collage/config';
import { config as imageUpscalerConfig } from './image-upscaler/config';
import { config as imageRedactConfig } from './image-redact/config';
import { config as pdfMergeConfig } from './pdf-merge/config';
import { config as pdfSplitConfig } from './pdf-split/config';
import { config as pdfExtractPagesConfig } from './pdf-extract-pages/config';
import { config as pdfReorganizeConfig } from './pdf-reorganize/config';
import { config as pdfEncryptConfig } from './pdf-encrypt/config';
import { config as pdfDecryptConfig } from './pdf-decrypt/config';
import { config as imageToPdfConfig } from './image-to-pdf/config';
import { config as pdfToImageConfig } from './pdf-to-image/config';
import { config as pdfExtractTextConfig } from './pdf-extract-text/config';
import { config as pdfCompressConfig } from './pdf-compress/config';
import { config as readabilityAnalyzerConfig } from './readability-analyzer/config';
import { config as readingTimeConfig } from './reading-time/config';
import { config as textCleanerConfig } from './text-cleaner/config';
import { config as diffViewerConfig } from './diff-viewer/config';
import { config as qrCodeGeneratorConfig } from './qr-code-generator/config';
import { config as passwordGeneratorConfig } from './password-generator/config';
import { config as unitConverterConfig } from './unit-converter/config';
import { config as calculatorConfig } from './calculator/config';
import { config as timestampConverterConfig } from './timestamp-converter/config';
import { config as stopwatchTimerConfig } from './stopwatch-timer/config';
import { config as colorPickerConfig } from './color-picker/config';
import { config as faviconGeneratorConfig } from './favicon-generator/config';
import { config as exifViewerConfig } from './exif-viewer/config';
import { config as fancyTextGeneratorConfig } from './fancy-text-generator/config';
import { config as emojiPickerConfig } from './emoji-picker/config';
import { config as imageBorderConfig } from './image-border/config';
import { config as gifEditorConfig } from './gif-editor/config';
import { config as memeGeneratorConfig } from './meme-generator/config';
import { config as gifMakerConfig } from './gif-maker/config';
import { config as videoConverterConfig } from './video-converter/config';
import { config as videoToGifConfig } from './video-to-gif/config';
import { config as videoCompressorConfig } from './video-compressor/config';
import { config as videoScreenRecorderConfig } from './video-screen-recorder/config';
import { config as videoCutterConfig } from './video-cutter/config';
import { config as videoMergerConfig } from './video-merger/config';
import { config as videoSpeedConfig } from './video-speed/config';
import { config as videoMuteExtractConfig } from './video-mute-extract/config';
import { config as videoWatermarkConfig } from './video-watermark/config';
import { config as videoRotateConfig } from './video-rotate/config';
import { config as videoCropConfig } from './video-crop/config';
import { config as pdfPageNumbersConfig } from './pdf-page-numbers/config';
import { config as pdfRotateConfig } from './pdf-rotate/config';

// Audio
import { config as audioConverterConfig } from './audio-converter/config';
import { config as m4aToMp3Config } from './m4a-to-mp3/config';
import { config as audioCutterConfig } from './audio-cutter/config';
import { config as audioCompressorConfig } from './audio-compressor/config';
import { config as audioMergerConfig } from './audio-merger/config';
import { config as audioRecorderConfig } from './audio-recorder/config';

// Calculators
import { config as bmiCalculatorConfig } from './bmi-calculator/config';
import { config as ageCalculatorConfig } from './age-calculator/config';
import { config as dateDifferenceCalculatorConfig } from './date-difference-calculator/config';
import { config as percentageCalculatorConfig } from './percentage-calculator/config';
import { config as loanCalculatorConfig } from './loan-calculator/config';
import { config as tipCalculatorConfig } from './tip-calculator/config';
import { config as discountCalculatorConfig } from './discount-calculator/config';
import { config as compoundInterestCalculatorConfig } from './compound-interest-calculator/config';
import { config as scientificCalculatorConfig } from './scientific-calculator/config';
import { config as gpaCalculatorConfig } from './gpa-calculator/config';

// Converters
import { config as lengthConverterConfig } from './length-converter/config';
import { config as weightConverterConfig } from './weight-converter/config';
import { config as temperatureConverterConfig } from './temperature-converter/config';
import { config as areaConverterConfig } from './area-converter/config';
import { config as volumeConverterConfig } from './volume-converter/config';
import { config as speedConverterConfig } from './speed-converter/config';
import { config as dataConverterConfig } from './data-converter/config';
import { config as romanNumeralConverterConfig } from './roman-numeral-converter/config';

// Audio P1 + P2
import { config as reverseAudioConfig } from './reverse-audio/config';
import { config as fadeInOutConfig } from './fade-in-out/config';
import { config as volumeNormalizerConfig } from './volume-normalizer/config';
import { config as silenceTrimConfig } from './silence-trim/config';
import { config as audioSpeedConfig } from './audio-speed/config';
import { config as pitchShifterConfig } from './pitch-shifter/config';
import { config as monoStereoConfig } from './mono-stereo-converter/config';
import { config as bpmDetectorConfig } from './bpm-detector/config';
import { config as micTestConfig } from './mic-test/config';

// Text & Encoding
import { config as textSorterConfig } from './text-sorter/config';
import { config as findReplaceConfig } from './find-replace/config';
import { config as htmlEntityConfig } from './html-entity-converter/config';
import { config as morseConfig } from './morse-code-converter/config';
import { config as baseConverterConfig } from './base-converter/config';
import { config as textReverserConfig } from './text-reverser/config';
import { config as wordFrequencyConfig } from './word-frequency/config';
import { config as whitespaceCleanerConfig } from './whitespace-cleaner/config';

// Developer
import { config as cronParserConfig } from './cron-parser/config';
import { config as chmodCalculatorConfig } from './chmod-calculator/config';
import { config as sqlFormatterConfig } from './sql-formatter/config';
import { config as jwtGeneratorConfig } from './jwt-generator/config';

// Utility
import { config as timezoneConverterConfig } from './timezone-converter/config';
import { config as hashGeneratorConfig } from './hash-generator/config';
import { config as loremIpsumConfig } from './lorem-ipsum/config';
import { config as randomGeneratorConfig } from './random-generator/config';

// Design
import { config as cssGradientConfig } from './css-gradient-generator/config';
import { config as boxShadowConfig } from './box-shadow-generator/config';
import { config as colorContrastConfig } from './color-contrast-checker/config';
import { config as aspectRatioConfig } from './aspect-ratio-calculator/config';

// Image
import { config as svgToPngConfig } from './svg-to-png/config';
import { config as imageFilterConfig } from './image-filter/config';
import { config as heicToJpgConfig } from './heic-to-jpg/config';
import { config as avifConverterConfig } from './avif-converter/config';
import { config as ocrConfig } from './ocr/config';

// PDF
import { config as pdfFlattenConfig } from './pdf-flatten/config';
import { config as pdfWatermarkConfig } from './pdf-watermark/config';
import { config as pdfStampConfig } from './pdf-stamp/config';

// Documents
import { config as csvToJsonConfig } from './csv-to-json/config';
import { config as jsonToCsvConfig } from './json-to-csv/config';
import { config as csvToExcelConfig } from './csv-to-excel/config';
import { config as jsonToExcelConfig } from './json-to-excel/config';
import { config as excelToCsvConfig } from './excel-to-csv/config';
import { config as excelToJsonConfig } from './excel-to-json/config';
import { config as markdownToPdfConfig } from './markdown-to-pdf/config';
import { config as wordToPdfConfig } from './word-to-pdf/config';
import { config as pptToPdfConfig } from './ppt-to-pdf/config';
import { config as xmlToJsonConfig } from './xml-to-json/config';

export const allTools: ToolConfig[] = [
  wordCounterConfig,
  caseConverterConfig,
  slugGeneratorConfig,
  jsonFormatterConfig,
  base64Config,
  urlEncoderConfig,
  uuidGeneratorConfig,
  regexTesterConfig,
  jwtDecoderConfig,
  metaTagGeneratorConfig,
  robotsTxtGeneratorConfig,
  sitemapGeneratorConfig,
  dnsLookupConfig,
  serpPreviewConfig,
  schemaGeneratorConfig,
  // Image — 格式转换
  imageConverterConfig,
  imageCompressorConfig,
  svgToPngConfig,
  avifConverterConfig,
  heicToJpgConfig,
  // Image — 编辑与调整
  imageResizeCropConfig,
  imageBackgroundRemoverConfig,
  imageWatermarkConfig,
  imageBorderConfig,
  imageCollageConfig,
  imageUpscalerConfig,
  imageRedactConfig,
  imageFilterConfig,
  // Image — 文字
  ocrConfig,
  // Image — 动图与表情
  gifEditorConfig,
  gifMakerConfig,
  memeGeneratorConfig,
  pdfMergeConfig,
  pdfSplitConfig,
  pdfExtractPagesConfig,
  pdfReorganizeConfig,
  pdfEncryptConfig,
  pdfDecryptConfig,
  imageToPdfConfig,
  pdfToImageConfig,
  pdfExtractTextConfig,
  pdfCompressConfig,
  readabilityAnalyzerConfig,
  readingTimeConfig,
  textCleanerConfig,
  diffViewerConfig,
  qrCodeGeneratorConfig,
  passwordGeneratorConfig,
  unitConverterConfig,
  calculatorConfig,
  timestampConverterConfig,
  stopwatchTimerConfig,
  colorPickerConfig,
  faviconGeneratorConfig,
  exifViewerConfig,
  fancyTextGeneratorConfig,
  emojiPickerConfig,
  videoConverterConfig,
  videoToGifConfig,
  videoCompressorConfig,
  videoScreenRecorderConfig,
  videoCutterConfig,
  videoMergerConfig,
  videoSpeedConfig,
  videoMuteExtractConfig,
  videoWatermarkConfig,
  videoRotateConfig,
  videoCropConfig,
  pdfPageNumbersConfig,
  pdfRotateConfig,
  // Audio — 格式转换
  audioConverterConfig,
  m4aToMp3Config,
  wavToMp3Config,
  flacToMp3Config,
  oggToMp3Config,
  mp3ToWavConfig,
  m4aToWavConfig,
  wavToFlacConfig,
  videoToMp3Config,
  audioCompressorConfig,
  // Audio — 剪辑
  audioCutterConfig,
  audioMergerConfig,
  silenceTrimConfig,
  audioSpeedConfig,
  reverseAudioConfig,
  // Audio — 音效调整
  fadeInOutConfig,
  volumeNormalizerConfig,
  pitchShifterConfig,
  monoStereoConfig,
  vocalRemoverConfig,
  // Audio — 录制与检测
  audioRecorderConfig,
  micTestConfig,
  bpmDetectorConfig,
  metronomeConfig,
  tunerConfig,
  whiteNoiseGeneratorConfig,
  // Calculators
  bmiCalculatorConfig,
  ageCalculatorConfig,
  dateDifferenceCalculatorConfig,
  percentageCalculatorConfig,
  loanCalculatorConfig,
  tipCalculatorConfig,
  discountCalculatorConfig,
  compoundInterestCalculatorConfig,
  scientificCalculatorConfig,
  gpaCalculatorConfig,
  // Converters
  lengthConverterConfig,
  weightConverterConfig,
  temperatureConverterConfig,
  areaConverterConfig,
  volumeConverterConfig,
  speedConverterConfig,
  dataConverterConfig,
  romanNumeralConverterConfig,
  // Text & Encoding
  textSorterConfig,
  findReplaceConfig,
  htmlEntityConfig,
  morseConfig,
  baseConverterConfig,
  textReverserConfig,
  wordFrequencyConfig,
  whitespaceCleanerConfig,
  // Developer
  cronParserConfig,
  chmodCalculatorConfig,
  sqlFormatterConfig,
  jwtGeneratorConfig,
  // Utility
  timezoneConverterConfig,
  hashGeneratorConfig,
  loremIpsumConfig,
  randomGeneratorConfig,
  // Design
  cssGradientConfig,
  boxShadowConfig,
  colorContrastConfig,
  aspectRatioConfig,
  // PDF
  pdfFlattenConfig,
  pdfWatermarkConfig,
  pdfStampConfig,
  // Documents
  csvToJsonConfig,
  jsonToCsvConfig,
  csvToExcelConfig,
  jsonToExcelConfig,
  excelToCsvConfig,
  excelToJsonConfig,
  markdownToPdfConfig,
  wordToPdfConfig,
  pptToPdfConfig,
  xmlToJsonConfig,
    mortgageCalculatorConfig,
    salesTaxCalculatorConfig,
    vatCalculatorConfig,
    salaryCalculatorConfig,
    roiCalculatorConfig,
    breakEvenCalculatorConfig,
    savingsGoalCalculatorConfig,
    retirementCalculatorConfig,
    inflationCalculatorConfig,
    tdeeCalculatorConfig,
    calorieCalculatorConfig,
    pregnancyDueDateCalculatorConfig,
    bodyFatCalculatorConfig,
    pngToJpgConfig,
    jpgToPngConfig,
    webpToJpgConfig,
    webpToPngConfig,
    pngToWebpConfig,
    jpgToWebpConfig,
    movToMp4Config,
    mkvToMp4Config,
    webmToMp4Config,
    aviToMp4Config,
    mp4ToWebmConfig,
    mp4ToMovConfig,
    keyboardTestConfig,
    mouseTestConfig,
    deadPixelTestConfig,
    webcamTestConfig,
    signatureMakerConfig,
];

export const getToolBySlug = (slug: string): ToolConfig | undefined =>
  allTools.find((t) => t.slug === slug);

export const getToolsByCategory = (category: string): ToolConfig[] =>
  allTools.filter((t) => t.category === category);

export const getCategories = (): string[] =>
  [...new Set(allTools.map((t) => t.category))];
