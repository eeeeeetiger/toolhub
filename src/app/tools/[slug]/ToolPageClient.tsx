'use client';

import { use, useState, useEffect } from 'react';
import { ToolLayout } from '@/components/tools/tool-layout';
import type { ToolConfig } from '@/tools/types';
import { toolJsonLd } from '@/lib/seo';
import { pushRecentSlug } from '@/lib/search';

import WordCounterClient from '@/tools/word-counter/WordCounterClient';
import CaseConverterClient from '@/tools/case-converter/CaseConverterClient';
import SlugGeneratorClient from '@/tools/slug-generator/SlugGeneratorClient';
import JsonFormatterClient from '@/tools/json-formatter/JsonFormatterClient';
import Base64Client from '@/tools/base64/Base64Client';
import UrlEncoderClient from '@/tools/url-encoder/UrlEncoderClient';
import UuidGeneratorClient from '@/tools/uuid-generator/UuidGeneratorClient';
import RegexTesterClient from '@/tools/regex-tester/RegexTesterClient';
import JwtDecoderClient from '@/tools/jwt-decoder/JwtDecoderClient';
import MetaTagGeneratorClient from '@/tools/meta-tag-generator/MetaTagGeneratorClient';
import RobotsTxtGeneratorClient from '@/tools/robots-txt-generator/RobotsTxtGeneratorClient';
import SitemapGeneratorClient from '@/tools/sitemap-generator/SitemapGeneratorClient';
import DnsLookupClient from '@/tools/dns-lookup/DnsLookupClient';
import SerpPreviewClient from '@/tools/serp-preview/SerpPreviewClient';
import SchemaGeneratorClient from '@/tools/schema-generator/SchemaGeneratorClient';
import ImageCompressorClient from '@/tools/image-compressor/ImageCompressorClient';
import ImageConverterClient from '@/tools/image-converter/ImageConverterClient';
import ImageBackgroundRemoverClient from '@/tools/image-background-remover/BackgroundRemoverClient';
import ImageResizeCropClient from '@/tools/image-resize-crop/ImageResizeCropClient';
import WatermarkClient from '@/tools/image-watermark/WatermarkClient';
import CollageClient from '@/tools/image-collage/CollageClient';
import UpscalerClient from '@/tools/image-upscaler/UpscalerClient';
import RedactClient from '@/tools/image-redact/RedactClient';
import PdfMergeClient from '@/tools/pdf-merge/PdfMergeClient';
import PdfSplitClient from '@/tools/pdf-split/PdfSplitClient';
import PdfExtractPagesClient from '@/tools/pdf-extract-pages/PdfExtractPagesClient';
import PdfReorganizeClient from '@/tools/pdf-reorganize/PdfReorganizeClient';
import PdfEncryptClient from '@/tools/pdf-encrypt/PdfEncryptClient';
import PdfDecryptClient from '@/tools/pdf-decrypt/PdfDecryptClient';
import ImageToPdfClient from '@/tools/image-to-pdf/ImageToPdfClient';
import PdfToImageClient from '@/tools/pdf-to-image/PdfToImageClient';
import PdfExtractTextClient from '@/tools/pdf-extract-text/PdfExtractTextClient';
import PdfCompressClient from '@/tools/pdf-compress/PdfCompressClient';
import ReadabilityAnalyzerClient from '@/tools/readability-analyzer/ReadabilityAnalyzerClient';
import ReadingTimeClient from '@/tools/reading-time/ReadingTimeClient';
import TextCleanerClient from '@/tools/text-cleaner/TextCleanerClient';
import DiffViewerClient from '@/tools/diff-viewer/DiffViewerClient';
import QrCodeGeneratorClient from '@/tools/qr-code-generator/QrCodeGeneratorClient';
import PasswordGeneratorClient from '@/tools/password-generator/PasswordGeneratorClient';
import UnitConverterClient from '@/tools/unit-converter/UnitConverterClient';
import CalculatorClient from '@/tools/calculator/CalculatorClient';
import TimestampConverterClient from '@/tools/timestamp-converter/TimestampConverterClient';
import StopwatchTimerClient from '@/tools/stopwatch-timer/StopwatchTimerClient';
import ColorPickerClient from '@/tools/color-picker/ColorPickerClient';
import FaviconGeneratorClient from '@/tools/favicon-generator/FaviconGeneratorClient';
import ExifViewerClient from '@/tools/exif-viewer/ExifViewerClient';
import FancyTextGeneratorClient from '@/tools/fancy-text-generator/FancyTextGeneratorClient';
import EmojiPickerClient from '@/tools/emoji-picker/EmojiPickerClient';
import ImageBorderClient from '@/tools/image-border/ImageBorderClient';
import GifEditorClient from '@/tools/gif-editor/GifEditorClient';
import MemeGeneratorClient from '@/tools/meme-generator/MemeGeneratorClient';
import GifMakerClient from '@/tools/gif-maker/GifMakerClient';
import VideoConverterClient from '@/tools/video-converter/VideoConverterClient';
import VideoToGifClient from '@/tools/video-to-gif/VideoToGifClient';
import VideoCompressorClient from '@/tools/video-compressor/VideoCompressorClient';
import VideoScreenRecorderClient from '@/tools/video-screen-recorder/VideoScreenRecorderClient';
import VideoCutterClient from '@/tools/video-cutter/VideoCutterClient';
import VideoMergerClient from '@/tools/video-merger/VideoMergerClient';
import VideoSpeedClient from '@/tools/video-speed/VideoSpeedClient';
import VideoMuteExtractClient from '@/tools/video-mute-extract/VideoMuteExtractClient';
import VideoWatermarkClient from '@/tools/video-watermark/VideoWatermarkClient';
import VideoRotateClient from '@/tools/video-rotate/VideoRotateClient';
import VideoCropClient from '@/tools/video-crop/VideoCropClient';
import PdfPageNumbersClient from '@/tools/pdf-page-numbers/PdfPageNumbersClient';
import PdfRotateClient from '@/tools/pdf-rotate/PdfRotateClient';

// Audio
import AudioConverterClient from '@/tools/audio-converter/AudioConverterClient';
import M4aToMp3Client from '@/tools/m4a-to-mp3/M4aToMp3Client';
import AudioCutterClient from '@/tools/audio-cutter/AudioCutterClient';
import AudioCompressorClient from '@/tools/audio-compressor/AudioCompressorClient';
import AudioMergerClient from '@/tools/audio-merger/AudioMergerClient';
import AudioRecorderClient from '@/tools/audio-recorder/AudioRecorderClient';

// Calculators (generic + GPA)
import GenericCalculatorClient from '@/tools/_shared/CalculatorClient';
import GpaCalculatorClient from '@/tools/gpa-calculator/GpaCalculatorClient';

// Converters (generic + Roman)
import GenericUnitConverterClient from '@/tools/_shared/UnitConverterClient';
import RomanNumeralClient from '@/tools/roman-numeral-converter/RomanNumeralClient';

// Audio P1 + P2
import AudioFxClient from '@/tools/_shared/AudioFxClient';
import BpmDetectorClient from '@/tools/bpm-detector/BpmDetectorClient';
import MicTestClient from '@/tools/mic-test/MicTestClient';

// Text
import TextToolClient from '@/tools/_shared/TextToolClient';

// Developer
import DevToolClient from '@/tools/_shared/DevToolClient';

// Utility
import UtilToolClient from '@/tools/_shared/UtilToolClient';

// Design
import DesignToolClient from '@/tools/_shared/DesignToolClient';

// Image
import SvgToPngClient from '@/tools/svg-to-png/SvgToPngClient';
import ImageFilterClient from '@/tools/image-filter/ImageFilterClient';
import HeicToJpgClient from '@/tools/heic-to-jpg/HeicToJpgClient';
import AvifConverterClient from '@/tools/avif-converter/AvifConverterClient';
import OcrClient from '@/tools/ocr/OcrClient';

// PDF
import PdfFlattenClient from '@/tools/pdf-flatten/PdfFlattenClient';
import PdfWatermarkClient from '@/tools/pdf-watermark/PdfWatermarkClient';
import PdfStampClient from '@/tools/pdf-stamp/PdfStampClient';

// Documents
import CsvJsonClient from '@/tools/_shared/CsvJsonClient';
import ExcelClient from '@/tools/_shared/ExcelClient';
import OfficePdfClient from '@/tools/_shared/OfficePdfClient';
import XmlJsonClient from '@/tools/_shared/XmlJsonClient';

import AudioFormatPairClient from '@/tools/_shared/AudioFormatPairClient';
import ImageFormatPairClient from '@/tools/_shared/ImageFormatPairClient';
import VideoFormatPairClient from '@/tools/_shared/VideoFormatPairClient';
import KeyboardTestClient from '@/tools/keyboard-test/KeyboardTestClient';
import MouseTestClient from '@/tools/mouse-test/MouseTestClient';
import DeadPixelTestClient from '@/tools/dead-pixel-test/DeadPixelTestClient';
import WebcamTestClient from '@/tools/webcam-test/WebcamTestClient';
import MetronomeClient from '@/tools/metronome/MetronomeClient';
import WhiteNoiseClient from '@/tools/white-noise-generator/WhiteNoiseClient';
import VocalRemoverClient from '@/tools/vocal-remover/VocalRemoverClient';
import TunerClient from '@/tools/tuner/TunerClient';
import SignatureMakerClient from '@/tools/signature-maker/SignatureMakerClient';

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
  'image-background-remover': ImageBackgroundRemoverClient,
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
  'whitespace-cleaner': TextToolClient,
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Register this visit so it surfaces in the home "Recent" section.
    pushRecentSlug(tool.slug);
  }, []);

  const ToolComponent = toolComponentMap[slug];

  if (!mounted || !ToolComponent) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
      </div>
    );
  }

  return (
    <ToolLayout tool={tool} schema={toolJsonLd(tool)}>
      <ToolComponent />
    </ToolLayout>
  );
}
