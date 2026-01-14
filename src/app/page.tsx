'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGradientGenerator } from '@/hooks/useGradientGenerator';
import { colorPresets } from '@/lib/constants';
import { Download, RefreshCw, Plus, Trash2, Copy, Link } from 'lucide-react';

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
    const params = new URLSearchParams({
      colors: colors.join(','),
      width: width.toString(),
      height: height.toString()
    });
    return `${baseUrl}?${params.toString()}`;
  };

  const copyApiLink = async () => {
    const apiLink = generateApiLink();
    try {
      await navigator.clipboard.writeText(apiLink);
      setApiLinkCopied(true);
      setTimeout(() => setApiLinkCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy API link:', err);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Gradient Background Generator</h1>
          <p className="text-muted-foreground">Create beautiful SVG gradient backgrounds with custom colors</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Preview Section */}
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 bg-muted/20 min-h-[400px] flex items-center justify-center">
                {svgContent ? (
                  <div 
                    dangerouslySetInnerHTML={{ __html: svgContent }}
                    className="max-w-full max-h-full"
                  />
                ) : (
                  <div className="text-muted-foreground">Loading...</div>
                )}
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={generateGradient} disabled={isGenerating}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate
                </Button>
                <Button onClick={downloadGradient} variant="outline" disabled={!svgContent}>
                  <Download className="w-4 h-4 mr-2" />
                  Download SVG
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Controls Section */}
          <div className="space-y-4">
            {/* Dimensions */}
            <Card className="shadow-sm">
              <CardHeader className="pb-2 pt-4">
                <CardTitle className="text-base">Dimensions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pb-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium mb-1 block">Width</label>
                    <Input
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(Number(e.target.value))}
                      min="100"
                      max="2000"
                      className="h-8 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block">Height</label>
                    <Input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                      min="100"
                      max="2000"
                      className="h-8 text-sm"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

{/* Color Controls */}
            <Card className="shadow-sm">
              <CardHeader className="pb-2 pt-4">
                <CardTitle className="text-base">Colors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pb-4">
                {colors.map((color, index) => (
                  <div key={index} className="flex items-center gap-1.5">
                    <Input
                      type="color"
                      value={color}
                      onChange={(e) => handleColorChange(index, e.target.value)}
                      className="w-10 h-7 p-0 rounded"
                    />
                    <Input
                      type="text"
                      value={color}
                      onChange={(e) => handleColorChange(index, e.target.value)}
                      placeholder="#000000"
                      className="text-xs h-7 px-2"
                    />
                    {colors.length > 1 && (
                      <Button
                        onClick={() => removeColor(index)}
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 hover:bg-red-50 hover:border-red-200"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                ))}
                
                {colors.length < 8 && (
                  <div className="flex items-center gap-1.5">
                    <Input
                      type="color"
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                      className="w-10 h-7 p-0 rounded"
                    />
                    <Input
                      type="text"
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                      placeholder="#000000"
                      className="text-xs h-7 px-2"
                    />
                    <Button onClick={addColor} disabled={!newColor} size="sm" className="h-7 text-xs px-2">
                      <Plus className="w-3 h-3 mr-1" />
                      Add
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Presets */}
            <Card className="shadow-sm">
              <CardHeader className="pb-2 pt-4">
                <CardTitle className="text-base">Preset Templates</CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="grid grid-cols-3 gap-1.5">
                  {colorPresets.map((preset) => (
                    <Button
                      key={preset.name}
                      onClick={() => applyPreset(preset)}
                      variant="outline"
                      className="h-auto p-2 flex flex-col items-center justify-center space-y-1 hover:border-primary/50"
                    >
                      <div className="text-xs font-medium text-center">
                        {preset.name}
                      </div>
                      <div className="flex gap-0.5">
                        {preset.colors.slice(0, 4).map((color, i) => (
                          <div
                            key={i}
                            className="w-3 h-3 rounded-sm"
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
        <Card className="mt-6 shadow-sm">
          <CardHeader className="pb-3 pt-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Link className="w-4 h-4" />
              Developer API Link
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <div className="bg-muted/50 border rounded-md p-3 font-mono text-xs break-all">
                    {generateApiLink()}
                  </div>
                </div>
                <Button
                  onClick={copyApiLink}
                  variant="outline"
                  size="sm"
                  className="h-8 px-2 flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  {apiLinkCopied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
              <div className="text-xs text-muted-foreground">
                <p>Use this API endpoint to generate gradients with the current parameters:</p>
                <ul className="mt-1 space-y-1 ml-4">
                  <li>• <code className="bg-muted px-1 rounded">colors</code>: Comma-separated hex colors</li>
                  <li>• <code className="bg-muted px-1 rounded">width</code>: Image width in pixels</li>
                  <li>• <code className="bg-muted px-1 rounded">height</code>: Image height in pixels</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
