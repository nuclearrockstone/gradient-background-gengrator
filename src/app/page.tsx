'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGradientGenerator } from '@/hooks/useGradientGenerator';
import { colorPresets } from '@/lib/constants';
import { colorToParam } from '@/lib/utils';
import { Download, RefreshCw, Plus, Trash2, Copy, Link, Palette, Sparkles, Layers } from 'lucide-react';

export default function GradientGenerator() {
  const {
    colors,
    setColors,
    width,
    setWidth,
    height,
    setHeight,
    svgContent,
    isGenerating,
    generateGradient,
    downloadGradient
  } = useGradientGenerator();

  const [newColor, setNewColor] = useState('');
  const [apiLinkCopied, setApiLinkCopied] = useState(false);

  useEffect(() => {
    generateGradient();
  }, [generateGradient]);

  const handleColorChange = (index: number, color: string) => {
    const newColors = [...colors];
    newColors[index] = color;
    setColors(newColors);
  };

  const addColor = () => {
    if (newColor && colors.length < 8) {
      setColors([...colors, newColor]);
      setNewColor('');
    }
  };

  const removeColor = (index: number) => {
    if (colors.length > 1) {
      const newColors = colors.filter((_, i) => i !== index);
      setColors(newColors);
    }
  };

const applyPreset = (preset: typeof colorPresets[0]) => {
    setColors(preset.colors);
  };

  const generateApiLink = () => {
    const baseUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/api`
      : '/api';
    const params = new URLSearchParams();
    colors.forEach(color => params.append('colors', colorToParam(color)));
    params.append('width', width.toString());
    params.append('height', height.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  const copyApiLink = async () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        const apiLink = generateApiLink();
        await navigator.clipboard.writeText(apiLink);
        setApiLinkCopied(true);
        setTimeout(() => setApiLinkCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy API link:', err);
      }
    } else {
      alert('Clipboard API not supported in this browser. Please manually copy the link.');
    }
  };

  console.log('SVG Content');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white/10 dark:bg-black/10 backdrop-blur-sm border-b border-gray-200/20 dark:border-gray-700/20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <Palette className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 dark:from-white via-gray-700 dark:via-gray-200 to-gray-900 dark:to-white bg-clip-text text-transparent mb-4">
            Gradient Generator
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed px-4">
            Create stunning SVG gradient backgrounds with our intuitive color palette and real-time preview
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-6 px-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Real-time Preview</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-900/20 rounded-full">
              <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">8 Colors Max</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 lg:gap-6">
          {/* Preview Section - Takes 3 columns on large screens */}
          <div className="xl:col-span-3 animate-fade-in card-stagger-1">
            <Card className="overflow-hidden border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md glow-hover">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-b border-gray-200/50 dark:border-gray-700/50">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  Live Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 sm:p-6 lg:p-8 min-h-[300px] sm:min-h-[400px] lg:min-h-[500px] flex items-center justify-center border border-gray-200/50 dark:border-gray-700/50 shadow-inner">
                  {svgContent ? (
                    <div 
                      dangerouslySetInnerHTML={{ __html: svgContent }}
                      className="w-full h-full rounded-xl shadow-2xl transform transition-all duration-500 hover:scale-[1.02] animate-fade-in"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-4 text-gray-400">
                      <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 dark:border-gray-700 border-t-blue-500 border-r-purple-500"></div>
                        <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-pink-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                      </div>
                      <div className="text-center">
                        <span className="text-sm font-medium animate-pulse">Generating beautiful gradient...</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <Button 
                    onClick={generateGradient} 
                    disabled={isGenerating}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg transition-all duration-200 hover:shadow-xl min-h-[44px]"
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                    {isGenerating ? 'Generating...' : 'Regenerate'}
                  </Button>
                  <Button 
                    onClick={downloadGradient} 
                    variant="outline" 
                    disabled={!svgContent}
                    className="px-4 sm:px-6 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 min-h-[44px]"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Download SVG</span>
                    <span className="sm:hidden">Download</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Controls Section - Takes 2 columns on large screens */}
          <div className="xl:col-span-2 space-y-6">
            {/* Dimensions */}
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md animate-slide-in-left card-stagger-3 glow-hover">
              <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border-b border-gray-200/50 dark:border-gray-700/50">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg">
                    <Layers className="w-4 h-4 text-white" />
                  </div>
                  Dimensions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                      Width (px)
                    </label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={width}
                        onChange={(e) => setWidth(Number(e.target.value))}
                        min="100"
                        max="2000"
                        className="h-12 text-lg font-mono bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 transition-all duration-200 focus:border-cyan-400 dark:focus:border-cyan-500"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                        px
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Min: 100, Max: 2000
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Height (px)
                    </label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(Number(e.target.value))}
                        min="100"
                        max="2000"
                        className="h-12 text-lg font-mono bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 transition-all duration-200 focus:border-blue-400 dark:focus:border-blue-500"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                        px
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Min: 100, Max: 2000
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Aspect Ratio:</span>
                    <span className="font-mono font-semibold text-gray-800 dark:text-gray-200">
                      {(width/height).toFixed(2)}:1
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-gray-600 dark:text-gray-400">Total Pixels:</span>
                    <span className="font-mono font-semibold text-gray-800 dark:text-gray-200">
                      {(width * height).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

 {/* Color Controls */}
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md animate-slide-in-right card-stagger-2 glow-hover">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-b border-gray-200/50 dark:border-gray-700/50">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                    <Palette className="w-4 h-4 text-white" />
                  </div>
                  Color Palette
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  {colors.map((color, index) => (
                    <div key={index} className="group relative">
                      <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50 transition-all duration-200 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-md">
                        <div className="relative">
                          <Input
                            type="color"
                            value={color}
                            onChange={(e) => handleColorChange(index, e.target.value)}
                            className="w-12 h-12 p-0 rounded-lg border-2 border-gray-300 dark:border-gray-600 cursor-pointer transition-all duration-200 hover:border-purple-400 dark:hover:border-purple-500 hover:scale-110"
                          />
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-white dark:bg-gray-800 rounded-full border-2 border-gray-300 dark:border-gray-600"></div>
                        </div>
                        <div className="flex-1">
                          <Input
                            type="text"
                            value={color.toUpperCase()}
                            onChange={(e) => handleColorChange(index, e.target.value)}
                            placeholder="#000000"
                            className="font-mono text-sm bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 transition-all duration-200 focus:border-purple-400 dark:focus:border-purple-500"
                          />
                        </div>
                        {colors.length > 1 && (
                          <Button
                            onClick={() => removeColor(index)}
                            variant="outline"
                            size="icon"
                            className="h-10 w-10 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-400 dark:hover:border-red-600 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {colors.length < 8 && (
                  <div className="pt-2">
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                      Add New Color ({colors.length}/8)
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50/30 dark:bg-gray-800/30">
                      <Input
                        type="color"
                        value={newColor}
                        onChange={(e) => setNewColor(e.target.value)}
                        className="w-12 h-12 p-0 rounded-lg border-2 border-gray-300 dark:border-gray-600 cursor-pointer transition-all duration-200 hover:border-green-400 dark:hover:border-green-500 hover:scale-110"
                      />
                      <div className="flex-1">
                        <Input
                          type="text"
                          value={newColor.toUpperCase()}
                          onChange={(e) => setNewColor(e.target.value)}
                          placeholder="#000000"
                          className="font-mono text-sm bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 transition-all duration-200 focus:border-green-400 dark:focus:border-green-500"
                        />
                      </div>
                      <Button 
                        onClick={addColor} 
                        disabled={!newColor} 
                        size="sm" 
                        className="h-10 px-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg transition-all duration-200 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Presets */}
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md animate-bounce-in card-stagger-4 glow-hover">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-b border-gray-200/50 dark:border-gray-700/50">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  Preset Templates
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-3">
                  {colorPresets.map((preset) => (
                    <Button
                      key={preset.name}
                      onClick={() => applyPreset(preset)}
                      variant="outline"
                      className="h-auto p-3 sm:p-4 flex flex-col items-center justify-center space-y-2 sm:space-y-3 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 transition-all duration-200 hover:border-orange-400 dark:hover:border-orange-600 hover:shadow-lg hover:scale-105 group"
                    >
                      <div className="w-full aspect-[2/1] rounded-lg overflow-hidden shadow-inner border border-gray-200 dark:border-gray-700">
                        <div 
                          className="w-full h-full"
                          style={{
                            background: `linear-gradient(135deg, ${preset.colors.join(', ')})`
                          }}
                        />
                      </div>
                      <div className="text-sm font-semibold text-gray-800 dark:text-gray-200 text-center group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-200">
                        {preset.name}
                      </div>
                      <div className="flex gap-1">
                        {preset.colors.slice(0, 4).map((color, i) => (
                          <div
                            key={i}
                            className="w-2 h-2 rounded-full ring-1 ring-white dark:ring-gray-900"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
</div>
        </div>

        {/* API Link Section */}
        <Card className="xl:col-span-5 border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md">
          <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-b border-gray-200/50 dark:border-gray-700/50">
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="p-2 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg">
                <Link className="w-4 h-4 text-white" />
              </div>
              Developer API Link
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200/50 dark:border-blue-800/50 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Link className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Note:</strong> Colors use <code className="bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded">hex_</code> prefix instead of # to avoid URL encoding issues. Example: <code className="bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded">hex_FF0000</code> instead of <code className="bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded">#FF0000</code>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <div className="absolute left-3 top-3">
                    <Link className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 pl-10 font-mono text-sm break-all shadow-inner">
                    {generateApiLink()}
                  </div>
                </div>
                <Button
                  onClick={copyApiLink}
                  variant="outline"
                  className="px-6 py-3 h-auto border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 group"
                >
                  <Copy className="w-4 h-4 mr-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200" />
                  <span className="group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200">
                    {apiLinkCopied ? 'Copied!' : 'Copy'}
                  </span>
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                  <code className="text-xs font-mono text-purple-600 dark:text-purple-400 font-bold">colors</code>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Hex colors in format hex_FFFFFF</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                  <code className="text-xs font-mono text-purple-600 dark:text-purple-400 font-bold">width</code>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Image width in pixels</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                  <code className="text-xs font-mono text-purple-600 dark:text-purple-400 font-bold">height</code>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Image height in pixels</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
