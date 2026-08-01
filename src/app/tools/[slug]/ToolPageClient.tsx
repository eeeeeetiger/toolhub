'use client';

import { use, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ToolLayout } from '@/components/tools/tool-layout';
import type { ToolConfig } from '@/tools/types';
import { toolJsonLd } from '@/lib/seo';
import { pushRecentSlug } from '@/lib/search';

const WordCounterClient = dynamic(() => import('@/tools/word-counter/WordCounterClient'));
const CaseConverterClient = dynamic(() => import('@/tools/case-converter/CaseConverterClient'));
const SlugGeneratorClient = dynamic(() => import('@/tools/slug-generator/SlugGeneratorClient'));
const JsonFormatterClient = dynamic(() => import('@/tools/json-formatter/JsonFormatterClient'));
const Base64Client = dynamic(() => import('@/tools/base64/Base64Client'));
const UrlEncoderClient = dynamic(() => import('@/tools/url-encoder/UrlEncoderClient'));
const UuidGeneratorClient = dynamic(() => import('@/tools/uuid-generator/UuidGeneratorClient'));
const RegexTesterClient = dynamic(() => import('@/tools/regex-tester/RegexTesterClient'));
const JwtDecoderClient = dynamic(() => import('@/tools/jwt-decoder/JwtDecoderClient'));
const MetaTagGeneratorClient = dynamic(() => import('@/tools/meta-tag-generator/MetaTagGeneratorClient'));
const RobotsTxtGeneratorClient = dynamic(() => import('@/tools/robots-txt-generator/RobotsTxtGeneratorClient'));
const SitemapGeneratorClient = dynamic(() => import('@/tools/sitemap-generator/SitemapGeneratorClient'));
const DnsLookupClient = dynamic(() => import('@/tools/dns-lookup/DnsLookupClient'));
const SerpPreviewClient = dynamic(() => import('@/tools/serp-preview/SerpPreviewClient'));
const SchemaGeneratorClient = dynamic(() => import('@/tools/schema-generator/SchemaGeneratorClient'));
const ImageCompressorClient = dynamic(() => import('@/tools/image-compressor/ImageCompressorClient'));
const ImageConverterClient = dynamic(() => import('@/tools/image-converter/ImageConverterClient'));
const ImageBackgroundRemoverClient = dynamic(() => import('@/tools/batch-background-remover/BackgroundRemoverClient'));
const ImageResizeCropClient = dynamic(() => import('@/tools/image-resize-crop/ImageResizeCropClient'));
const WatermarkClient = dynamic(() => import('@/tools/image-watermark/WatermarkClient'));
const CollageClient = dynamic(() => import('@/tools/image-collage/CollageClient'));
const UpscalerClient = dynamic(() => import('@/tools/image-upscaler/UpscalerClient'));
const RedactClient = dynamic(() => import('@/tools/image-redact/RedactClient'));
const PdfMergeClient = dynamic(() => import('@/tools/pdf-merge/PdfMergeClient'));
const PdfSplitClient = dynamic(() => import('@/tools/pdf-split/PdfSplitClient'));
const PdfExtractPagesClient = dynamic(() => import('@/tools/pdf-extract-pages/PdfExtractPagesClient'));
const PdfReorganizeClient = dynamic(() => import('@/tools/pdf-reorganize/PdfReorganizeClient'));
const PdfEncryptClient = dynamic(() => import('@/tools/pdf-encrypt/PdfEncryptClient'));
const PdfDecryptClient = dynamic(() => import('@/tools/pdf-decrypt/PdfDecryptClient'));
const ImageToPdfClient = dynamic(() => import('@/tools/image-to-pdf/ImageToPdfClient'));
const PdfToImageClient = dynamic(() => import('@/tools/pdf-to-image/PdfToImageClient'));
const PdfExtractTextClient = dynamic(() => import('@/tools/pdf-extract-text/PdfExtractTextClient'));
const PdfCompressClient = dynamic(() => import('@/tools/pdf-compress/PdfCompressClient'));
const ReadabilityAnalyzerClient = dynamic(() => import('@/tools/readability-analyzer/ReadabilityAnalyzerClient'));
const ReadingTimeClient = dynamic(() => import('@/tools/reading-time/ReadingTimeClient'));
const TextCleanerClient = dynamic(() => import('@/tools/text-cleaner/TextCleanerClient'));
const DiffViewerClient = dynamic(() => import('@/tools/diff-viewer/DiffViewerClient'));
const QrCodeGeneratorClient = dynamic(() => import('@/tools/qr-code-generator/QrCodeGeneratorClient'));
const PasswordGeneratorClient = dynamic(() => import('@/tools/password-generator/PasswordGeneratorClient'));
const UnitConverterClient = dynamic(() => import('@/tools/unit-converter/UnitConverterClient'));
const CalculatorClient = dynamic(() => import('@/tools/calculator/CalculatorClient'));
const TimestampConverterClient = dynamic(() => import('@/tools/timestamp-converter/TimestampConverterClient'));
const StopwatchTimerClient = dynamic(() => import('@/tools/stopwatch-timer/StopwatchTimerClient'));
const ColorPickerClient = dynamic(() => import('@/tools/color-picker/ColorPickerClient'));
const FaviconGeneratorClient = dynamic(() => import('@/tools/favicon-generator/FaviconGeneratorClient'));
const ExifViewerClient = dynamic(() => import('@/tools/exif-viewer/ExifViewerClient'));
const FancyTextGeneratorClient = dynamic(() => import('@/tools/fancy-text-generator/FancyTextGeneratorClient'));
const EmojiPickerClient = dynamic(() => import('@/tools/emoji-picker/EmojiPickerClient'));
const ImageBorderClient = dynamic(() => import('@/tools/image-border/ImageBorderClient'));
const GifEditorClient = dynamic(() => import('@/tools/gif-editor/GifEditorClient'));
const MemeGeneratorClient = dynamic(() => import('@/tools/meme-generator/MemeGeneratorClient'));
const GifMakerClient = dynamic(() => import('@/tools/gif-maker/GifMakerClient'));
const VideoConverterClient = dynamic(() => import('@/tools/video-converter/VideoConverterClient'));
const VideoToGifClient = dynamic(() => import('@/tools/video-to-gif/VideoToGifClient'));
const VideoCompressorClient = dynamic(() => import('@/tools/video-compressor/VideoCompressorClient'));
const VideoScreenRecorderClient = dynamic(() => import('@/tools/video-screen-recorder/VideoScreenRecorderClient'));
const VideoCutterClient = dynamic(() => import('@/tools/video-cutter/VideoCutterClient'));
const VideoMergerClient = dynamic(() => import('@/tools/video-merger/VideoMergerClient'));
const VideoSpeedClient = dynamic(() => import('@/tools/video-speed/VideoSpeedClient'));
const VideoMuteExtractClient = dynamic(() => import('@/tools/video-mute-extract/VideoMuteExtractClient'));
const VideoWatermarkClient = dynamic(() => import('@/tools/video-watermark/VideoWatermarkClient'));
const VideoRotateClient = dynamic(() => import('@/tools/video-rotate/VideoRotateClient'));
const VideoCropClient = dynamic(() => import('@/tools/video-crop/VideoCropClient'));
const PdfPageNumbersClient = dynamic(() => import('@/tools/pdf-page-numbers/PdfPageNumbersClient'));
const PdfRotateClient = dynamic(() => import('@/tools/pdf-rotate/PdfRotateClient'));

// Audio
const AudioConverterClient = dynamic(() => import('@/tools/audio-converter/AudioConverterClient'));
const M4aToMp3Client = dynamic(() => import('@/tools/m4a-to-mp3/M4aToMp3Client'));
const AudioCutterClient = dynamic(() => import('@/tools/audio-cutter/AudioCutterClient'));
const AudioCompressorClient = dynamic(() => import('@/tools/audio-compressor/AudioCompressorClient'));
const AudioMergerClient = dynamic(() => import('@/tools/audio-merger/AudioMergerClient'));
const AudioRecorderClient = dynamic(() => import('@/tools/audio-recorder/AudioRecorderClient'));

// Calculators (generic + GPA)
const GenericCalculatorClient = dynamic(() => import('@/tools/_shared/CalculatorClient'));
const GpaCalculatorClient = dynamic(() => import('@/tools/gpa-calculator/GpaCalculatorClient'));

// Converters (generic + Roman)
const GenericUnitConverterClient = dynamic(() => import('@/tools/_shared/UnitConverterClient'));
const RomanNumeralClient = dynamic(() => import('@/tools/roman-numeral-converter/RomanNumeralClient'));

// Audio P1 + P2
const AudioFxClient = dynamic(() => import('@/tools/_shared/AudioFxClient'));
const BpmDetectorClient = dynamic(() => import('@/tools/bpm-detector/BpmDetectorClient'));
const MicTestClient = dynamic(() => import('@/tools/mic-test/MicTestClient'));

// Text
const TextToolClient = dynamic(() => import('@/tools/_shared/TextToolClient'));

// Developer
const DevToolClient = dynamic(() => import('@/tools/_shared/DevToolClient'));

// Utility
const UtilToolClient = dynamic(() => import('@/tools/_shared/UtilToolClient'));

// Design
const DesignToolClient = dynamic(() => import('@/tools/_shared/DesignToolClient'));

// Image
const SvgToPngClient = dynamic(() => import('@/tools/svg-to-png/SvgToPngClient'));
const ImageFilterClient = dynamic(() => import('@/tools/image-filter/ImageFilterClient'));
const HeicToJpgClient = dynamic(() => import('@/tools/heic-to-jpg/HeicToJpgClient'));
const AvifConverterClient = dynamic(() => import('@/tools/avif-converter/AvifConverterClient'));
const OcrClient = dynamic(() => import('@/tools/ocr/OcrClient'));
const ImageCutoutClient = dynamic(() => import('@/tools/_shared/ImageCutoutClient'));

// PDF
const PdfFlattenClient = dynamic(() => import('@/tools/pdf-flatten/PdfFlattenClient'));
const PdfWatermarkClient = dynamic(() => import('@/tools/pdf-watermark/PdfWatermarkClient'));
const PdfStampClient = dynamic(() => import('@/tools/pdf-stamp/PdfStampClient'));

// Documents
const CsvJsonClient = dynamic(() => import('@/tools/_shared/CsvJsonClient'));
const ExcelClient = dynamic(() => import('@/tools/_shared/ExcelClient'));
const OfficePdfClient = dynamic(() => import('@/tools/_shared/OfficePdfClient'));
const XmlJsonClient = dynamic(() => import('@/tools/_shared/XmlJsonClient'));

const AudioFormatPairClient = dynamic(() => import('@/tools/_shared/AudioFormatPairClient'));
const ImageFormatPairClient = dynamic(() => import('@/tools/_shared/ImageFormatPairClient'));
const VideoFormatPairClient = dynamic(() => import('@/tools/_shared/VideoFormatPairClient'));
const KeyboardTestClient = dynamic(() => import('@/tools/keyboard-test/KeyboardTestClient'));
const MouseTestClient = dynamic(() => import('@/tools/mouse-test/MouseTestClient'));
const DeadPixelTestClient = dynamic(() => import('@/tools/dead-pixel-test/DeadPixelTestClient'));
const WebcamTestClient = dynamic(() => import('@/tools/webcam-test/WebcamTestClient'));
const MetronomeClient = dynamic(() => import('@/tools/metronome/MetronomeClient'));
const WhiteNoiseClient = dynamic(() => import('@/tools/white-noise-generator/WhiteNoiseClient'));
const VocalRemoverClient = dynamic(() => import('@/tools/vocal-remover/VocalRemoverClient'));
const TunerClient = dynamic(() => import('@/tools/tuner/TunerClient'));
const SignatureMakerClient = dynamic(() => import('@/tools/signature-maker/SignatureMakerClient'));

const toolComponentMap: Record<string, React.ComponentType> = {
  'word-counter': WordCounterClient,
  'case-converter': CaseConverterClient,
  'slug-generator': SlugGeneratorClient,
  'json-formatter': JsonFormatterClient,
  base64: Base64Client,
  'url-encoder': UrlEncoderClient,
  'uuid-generator': UuidGeneratorClient,
  'regex-tester': RegexTesterClient,
  'jwt-decoder': JwtDecoderClient,
  'meta-tag-generator': MetaTagGeneratorClient,
  'robots-txt-generator': RobotsTxtGeneratorClient,
  'sitemap-generator': SitemapGeneratorClient,
  'dns-lookup': DnsLookupClient,
  'serp-preview': SerpPreviewClient,
  'schema-generator': SchemaGeneratorClient,
  'image-compressor': ImageCompressorClient,
  'image-converter': ImageConverterClient,
  'batch-background-remover': ImageBackgroundRemoverClient,
  'image-resize-crop': ImageResizeCropClient,
  'image-watermark': WatermarkClient,
  'image-collage': CollageClient,
  'image-upscaler': UpscalerClient,
  'image-redact': RedactClient,
  'pdf-merge': PdfMergeClient,
  'pdf-split': PdfSplitClient,
  'pdf-extract-pages': PdfExtractPagesClient,
  'pdf-reorganize': PdfReorganizeClient,
  'pdf-encrypt': PdfEncryptClient,
  'pdf-decrypt': PdfDecryptClient,
  'image-to-pdf': ImageToPdfClient,
  'pdf-to-image': PdfToImageClient,
  'pdf-extract-text': PdfExtractTextClient,
  'pdf-compress': PdfCompressClient,
  'readability-analyzer': ReadabilityAnalyzerClient,
  'reading-time': ReadingTimeClient,
  'text-cleaner': TextCleanerClient,
  'diff-viewer': DiffViewerClient,
  'qr-code-generator': QrCodeGeneratorClient,
  'password-generator': PasswordGeneratorClient,
  'unit-converter': UnitConverterClient,
  'calculator': CalculatorClient,
  'timestamp-converter': TimestampConverterClient,
  'stopwatch-timer': StopwatchTimerClient,
  'color-picker': ColorPickerClient,
  'favicon-generator': FaviconGeneratorClient,
  'exif-viewer': ExifViewerClient,
  'fancy-text-generator': FancyTextGeneratorClient,
  'emoji-picker': EmojiPickerClient,
  'image-border': ImageBorderClient,
  'gif-editor': GifEditorClient,
  'meme-generator': MemeGeneratorClient,
  'gif-maker': GifMakerClient,
  'video-converter': VideoConverterClient,
  'video-to-gif': VideoToGifClient,
  'video-compressor': VideoCompressorClient,
  'video-screen-recorder': VideoScreenRecorderClient,
  'video-cutter': VideoCutterClient,
  'video-merger': VideoMergerClient,
  'video-speed': VideoSpeedClient,
  'video-mute-extract': VideoMuteExtractClient,
  'video-watermark': VideoWatermarkClient,
  'video-rotate': VideoRotateClient,
  'video-crop': VideoCropClient,
  'pdf-page-numbers': PdfPageNumbersClient,
  'pdf-rotate': PdfRotateClient,
  // Audio
  'audio-converter': AudioConverterClient,
  'm4a-to-mp3': M4aToMp3Client,
  'audio-cutter': AudioCutterClient,
  'audio-compressor': AudioCompressorClient,
  'audio-merger': AudioMergerClient,
  'audio-recorder': AudioRecorderClient,
  // Calculators
  'bmi-calculator': GenericCalculatorClient,
  'age-calculator': GenericCalculatorClient,
  'date-difference-calculator': GenericCalculatorClient,
  'percentage-calculator': GenericCalculatorClient,
  'loan-calculator': GenericCalculatorClient,
  'tip-calculator': GenericCalculatorClient,
  'discount-calculator': GenericCalculatorClient,
  'compound-interest-calculator': GenericCalculatorClient,
  'scientific-calculator': GenericCalculatorClient,
  'gpa-calculator': GpaCalculatorClient,
  // Converters
  'length-converter': GenericUnitConverterClient,
  'weight-converter': GenericUnitConverterClient,
  'temperature-converter': GenericUnitConverterClient,
  'area-converter': GenericUnitConverterClient,
  'volume-converter': GenericUnitConverterClient,
  'speed-converter': GenericUnitConverterClient,
  'data-converter': GenericUnitConverterClient,
  'roman-numeral-converter': RomanNumeralClient,
  // Audio P1 + P2
  'reverse-audio': AudioFxClient,
  'fade-in-out': AudioFxClient,
  'volume-normalizer': AudioFxClient,
  'silence-trim': AudioFxClient,
  'audio-speed': AudioFxClient,
  'pitch-shifter': AudioFxClient,
  'mono-stereo-converter': AudioFxClient,
  'bpm-detector': BpmDetectorClient,
  'mic-test': MicTestClient,
  // Text & Encoding
  'text-sorter': TextToolClient,
  'find-replace': TextToolClient,
  'html-entity-converter': TextToolClient,
  'morse-code-converter': TextToolClient,
  'base-converter': TextToolClient,
  'text-reverser': TextToolClient,
  'word-frequency': TextToolClient,
  // Developer
  'cron-parser': DevToolClient,
  'chmod-calculator': DevToolClient,
  'sql-formatter': DevToolClient,
  'jwt-generator': DevToolClient,
  // Utility
  'timezone-converter': UtilToolClient,
  'hash-generator': UtilToolClient,
  'lorem-ipsum': UtilToolClient,
  'random-generator': UtilToolClient,
  // Design
  'css-gradient-generator': DesignToolClient,
  'box-shadow-generator': DesignToolClient,
  'color-contrast-checker': DesignToolClient,
  'aspect-ratio-calculator': DesignToolClient,
  // Image
  'svg-to-png': SvgToPngClient,
  'image-filter': ImageFilterClient,
  'heic-to-jpg': HeicToJpgClient,
  'avif-converter': AvifConverterClient,
  'ocr': OcrClient,
  'ai-photo-cutout': ImageCutoutClient,
  'portrait-cutout': ImageCutoutClient,
  // PDF
  'pdf-flatten': PdfFlattenClient,
  'pdf-watermark': PdfWatermarkClient,
  'pdf-stamp': PdfStampClient,
  // Documents
  'csv-to-json': CsvJsonClient,
  'json-to-csv': CsvJsonClient,
  'csv-to-excel': ExcelClient,
  'json-to-excel': ExcelClient,
  'excel-to-csv': ExcelClient,
  'excel-to-json': ExcelClient,
  'markdown-to-pdf': OfficePdfClient,
  'word-to-pdf': OfficePdfClient,
  'ppt-to-pdf': OfficePdfClient,
  'xml-to-json': XmlJsonClient,
    'mortgage-calculator': GenericCalculatorClient,
    'sales-tax-calculator': GenericCalculatorClient,
    'vat-calculator': GenericCalculatorClient,
    'salary-calculator': GenericCalculatorClient,
    'roi-calculator': GenericCalculatorClient,
    'break-even-calculator': GenericCalculatorClient,
    'savings-goal-calculator': GenericCalculatorClient,
    'retirement-calculator': GenericCalculatorClient,
    'inflation-calculator': GenericCalculatorClient,
    'tdee-calculator': GenericCalculatorClient,
    'calorie-calculator': GenericCalculatorClient,
    'pregnancy-due-date-calculator': GenericCalculatorClient,
    'body-fat-calculator': GenericCalculatorClient,
    'wav-to-mp3': AudioFormatPairClient,
    'flac-to-mp3': AudioFormatPairClient,
    'ogg-to-mp3': AudioFormatPairClient,
    'mp3-to-wav': AudioFormatPairClient,
    'm4a-to-wav': AudioFormatPairClient,
    'wav-to-flac': AudioFormatPairClient,
    'video-to-mp3': AudioFormatPairClient,
    'png-to-jpg': ImageFormatPairClient,
    'jpg-to-png': ImageFormatPairClient,
    'webp-to-jpg': ImageFormatPairClient,
    'webp-to-png': ImageFormatPairClient,
    'png-to-webp': ImageFormatPairClient,
    'jpg-to-webp': ImageFormatPairClient,
    'mov-to-mp4': VideoFormatPairClient,
    'mkv-to-mp4': VideoFormatPairClient,
    'webm-to-mp4': VideoFormatPairClient,
    'avi-to-mp4': VideoFormatPairClient,
    'mp4-to-webm': VideoFormatPairClient,
    'mp4-to-mov': VideoFormatPairClient,
    'keyboard-test': KeyboardTestClient,
    'mouse-test': MouseTestClient,
    'dead-pixel-test': DeadPixelTestClient,
    'webcam-test': WebcamTestClient,
    'metronome': MetronomeClient,
    'white-noise-generator': WhiteNoiseClient,
    'vocal-remover': VocalRemoverClient,
    'tuner': TunerClient,
    'signature-maker': SignatureMakerClient,
};

export default function ToolPageClient({
  params,
  tool,
}: {
  params: Promise<{ slug: string }>;
  tool: ToolConfig;
}) {
  const { slug } = use(params);

  useEffect(() => {
    // Register this visit so it surfaces in the home "Recent" section.
    pushRecentSlug(tool.slug);
  }, [tool.slug]);

  const ToolComponent = toolComponentMap[slug];

  if (!ToolComponent) {
    return (
      <ToolLayout tool={tool} schema={toolJsonLd(tool)}>
        <p className="py-16 text-center text-sm text-slate-600">
          This tool is temporarily unavailable.
        </p>
      </ToolLayout>
    );
  }

  return (
    <ToolLayout tool={tool} schema={toolJsonLd(tool)}>
      <ToolComponent />
    </ToolLayout>
  );
}
