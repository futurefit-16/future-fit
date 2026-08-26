"use client";

import { useCanvas } from "./CanvasContext";
import { useState, useEffect } from "react";
import * as fabric from "fabric";
import { Palette, Move, RotateCw, Maximize2, FlipHorizontal, FlipVertical } from "lucide-react";

export default function PropertiesPanel() {
    const { canvas, activeObject } = useCanvas();
    const [selectedColor, setSelectedColor] = useState('#000000');
    const [isGradientMode, setIsGradientMode] = useState(false);
    const [gradientAngle, setGradientAngle] = useState(0);
    const [forceUpdate, setForceUpdate] = useState(0);

    // Listen for object modifications to update UI
    useEffect(() => {
        if (!canvas) return;

        const handleObjectModified = () => {
            setForceUpdate(prev => prev + 1);
        };

        canvas.on('object:modified', handleObjectModified);
        canvas.on('object:scaling', handleObjectModified);
        canvas.on('object:resizing', handleObjectModified);

        return () => {
            canvas.off('object:modified', handleObjectModified);
            canvas.off('object:scaling', handleObjectModified);
            canvas.off('object:resizing', handleObjectModified);
        };
    }, [canvas]);

    if (!activeObject) return null;

    // Color options
    const colorOptions = [
        '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
        '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#FFC0CB', '#A52A2A',
        '#808080', '#C0C0C0', '#FFD700', '#4B0082', '#008080', '#F0E68C'
    ];

    // Gradient presets
    const gradientPresets = [
        { name: 'Sunset', colors: ['#FF6B6B', '#FFE66D'], angle: 45 },
        { name: 'Ocean', colors: ['#4ECDC4', '#44A08D'], angle: 90 },
        { name: 'Purple', colors: ['#667EEA', '#764BA2'], angle: 135 },
        { name: 'Fire', colors: ['#F12711', '#F5AF19'], angle: 180 },
        { name: 'Forest', colors: ['#134E5E', '#71B280'], angle: 270 },
        { name: 'Sky', colors: ['#56CCF2', '#2F80ED'], angle: 0 }
    ];

    const handleColorChange = (color: string) => {
        if (!canvas || !activeObject) return;
        setSelectedColor(color);
        setIsGradientMode(false);

        console.log('Applying color:', color, 'to object type:', activeObject.type);

        try {
            if (activeObject.type === 'text' || activeObject.type === 'i-text') {
                (activeObject as fabric.Text).set('fill', color);
                console.log('Applied color to text');
            } else if (activeObject.type === 'rect' || activeObject.type === 'circle' || activeObject.type === 'triangle') {
                (activeObject as fabric.Object).set('fill', color);
                console.log('Applied color to shape');
            } else if (activeObject.type === 'path' || activeObject.type === 'group') {
                (activeObject as fabric.Object).set('fill', color);
                console.log('Applied color to path/group');
            } else if (activeObject.type === 'image') {
                (activeObject as fabric.Image).set('tint', color);
                console.log('Applied tint to image');
            } else {
                // Fallback for any other object type
                (activeObject as fabric.Object).set('fill', color);
                console.log('Applied color to unknown object type');
            }

            canvas.requestRenderAll();
            setForceUpdate(prev => prev + 1);
        } catch (error) {
            console.error('Error applying color:', error);
        }
    };

    const handleGradientChange = (colors: string[], angle: number) => {
        if (!canvas || !activeObject) return;
        setIsGradientMode(true);

        console.log('Applying gradient:', colors, 'angle:', angle, 'to object type:', activeObject.type);

        try {
            const gradient = new fabric.Gradient({
                type: 'linear',
                gradientUnits: 'pixels',
                coords: {
                    x1: 0,
                    y1: 0,
                    x2: Math.cos(angle * Math.PI / 180) * 100,
                    y2: Math.sin(angle * Math.PI / 180) * 100
                },
                colorStops: [
                    { offset: 0, color: colors[0] },
                    { offset: 1, color: colors[1] }
                ]
            });

            if (activeObject.type === 'text' || activeObject.type === 'i-text') {
                (activeObject as fabric.Text).set('fill', gradient);
                console.log('Applied gradient to text');
            } else if (activeObject.type === 'rect' || activeObject.type === 'circle' || activeObject.type === 'triangle') {
                (activeObject as fabric.Object).set('fill', gradient);
                console.log('Applied gradient to shape');
            } else if (activeObject.type === 'path' || activeObject.type === 'group') {
                (activeObject as fabric.Object).set('fill', gradient);
                console.log('Applied gradient to path/group');
            } else {
                // Fallback for any other object type
                (activeObject as fabric.Object).set('fill', gradient);
                console.log('Applied gradient to unknown object type');
            }

            canvas.requestRenderAll();
            setForceUpdate(prev => prev + 1);
        } catch (error) {
            console.error('Error applying gradient:', error);
        }
    };

    const handleColorCodeInput = (colorCode: string) => {
        // Support hex, rgb, rgba, hsl, hsla
        const colorRegex = /^(#([0-9A-Fa-f]{3}){1,2}|rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)|rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)|hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)|hsla\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*,\s*[\d.]+\s*\))$/;
        
        if (colorRegex.test(colorCode)) {
            handleColorChange(colorCode);
        }
    };

    return (
        <div className="flex flex-col gap-4 w-full">
            {/* Basic Properties Section */}
            {(activeObject.type === 'text' || activeObject.type === 'i-text') && (
                <div>
                    <h3 className="font-semibold text-xs uppercase text-muted-foreground mb-3">Text Properties</h3>
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs text-muted-foreground">Font Size</label>
                            <input
                                type="number"
                                value={Math.round(((activeObject as fabric.Text).fontSize || 20) * ((activeObject as fabric.Text).scaleX || 1))}
                                onChange={(e) => {
                                    const size = parseInt(e.target.value);
                                    if (!isNaN(size) && size > 0) {
                                        const textObj = activeObject as fabric.Text;
                                        const currentScale = textObj.scaleX || 1;
                                        textObj.set('fontSize', size / currentScale);
                                        canvas?.requestRenderAll();
                                        // Force component re-render to update input value
                                        setForceUpdate(prev => prev + 1);
                                    }
                                }}
                                onBlur={(e) => {
                                    // Force update on blur to ensure value is correct
                                    const size = parseInt(e.target.value);
                                    if (!isNaN(size) && size > 0) {
                                        const textObj = activeObject as fabric.Text;
                                        const currentScale = textObj.scaleX || 1;
                                        textObj.set('fontSize', size / currentScale);
                                        canvas?.requestRenderAll();
                                        setForceUpdate(prev => prev + 1);
                                    }
                                }}
                                className="w-full px-2 py-1 text-xs border border-border rounded bg-background"
                                min="8"
                                max="200"
                                step="1"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Actual size: {Math.round((activeObject as fabric.Text).fontSize || 20)}px
                            </p>
                        </div>
                        <div>
                            <label className="text-xs text-muted-foreground">Font Weight</label>
                            <select
                                value={(activeObject as fabric.Text).fontWeight || 'normal'}
                                onChange={(e) => {
                                    (activeObject as fabric.Text).set('fontWeight', e.target.value);
                                    canvas?.requestRenderAll();
                                }}
                                className="w-full px-2 py-1 text-xs border border-border rounded bg-background"
                            >
                                <option value="normal">Normal</option>
                                <option value="bold">Bold</option>
                                <option value="lighter">Light</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Transform Controls Section */}
            <div className="border-t border-border pt-4">
                <h3 className="font-semibold text-xs uppercase text-muted-foreground mb-3 flex items-center gap-2">
                    <Move size={12} />
                    Transform
                </h3>
                <div className="space-y-3">
                    {/* Position Controls */}
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="text-xs text-muted-foreground">X Position</label>
                            <input
                                type="number"
                                value={Math.round(activeObject.left || 0)}
                                onChange={(e) => {
                                    const x = parseInt(e.target.value);
                                    if (!isNaN(x)) {
                                        activeObject.set('left', x);
                                        canvas?.requestRenderAll();
                                        setForceUpdate(prev => prev + 1);
                                    }
                                }}
                                className="w-full px-2 py-1 text-xs border border-border rounded bg-background"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-muted-foreground">Y Position</label>
                            <input
                                type="number"
                                value={Math.round(activeObject.top || 0)}
                                onChange={(e) => {
                                    const y = parseInt(e.target.value);
                                    if (!isNaN(y)) {
                                        activeObject.set('top', y);
                                        canvas?.requestRenderAll();
                                        setForceUpdate(prev => prev + 1);
                                    }
                                }}
                                className="w-full px-2 py-1 text-xs border border-border rounded bg-background"
                            />
                        </div>
                    </div>

                    {/* Size Controls */}
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="text-xs text-muted-foreground">Width</label>
                            <input
                                type="number"
                                value={Math.round((activeObject.width || 0) * (activeObject.scaleX || 1))}
                                onChange={(e) => {
                                    const width = parseInt(e.target.value);
                                    if (!isNaN(width) && width > 0) {
                                        const currentScaleX = activeObject.scaleX || 1;
                                        activeObject.set('width', width / currentScaleX);
                                        canvas?.requestRenderAll();
                                        setForceUpdate(prev => prev + 1);
                                    }
                                }}
                                className="w-full px-2 py-1 text-xs border border-border rounded bg-background"
                                min="10"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-muted-foreground">Height</label>
                            <input
                                type="number"
                                value={Math.round((activeObject.height || 0) * (activeObject.scaleY || 1))}
                                onChange={(e) => {
                                    const height = parseInt(e.target.value);
                                    if (!isNaN(height) && height > 0) {
                                        const currentScaleY = activeObject.scaleY || 1;
                                        activeObject.set('height', height / currentScaleY);
                                        canvas?.requestRenderAll();
                                        setForceUpdate(prev => prev + 1);
                                    }
                                }}
                                className="w-full px-2 py-1 text-xs border border-border rounded bg-background"
                                min="10"
                            />
                        </div>
                    </div>

                    {/* Rotation Control */}
                    <div>
                        <label className="text-xs text-muted-foreground">Rotation</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="range"
                                min="0"
                                max="360"
                                value={Math.round((activeObject.angle || 0) % 360)}
                                onChange={(e) => {
                                    const angle = parseInt(e.target.value);
                                    activeObject.set('angle', angle);
                                    canvas?.requestRenderAll();
                                    setForceUpdate(prev => prev + 1);
                                }}
                                className="flex-1"
                            />
                            <span className="text-xs text-muted-foreground w-12 text-right">
                                {Math.round((activeObject.angle || 0) % 360)}°
                            </span>
                        </div>
                    </div>

                    {/* Flip Controls */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                const currentFlipX = activeObject.flipX || false;
                                activeObject.set('flipX', !currentFlipX);
                                canvas?.requestRenderAll();
                                setForceUpdate(prev => prev + 1);
                            }}
                            className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-xs border border-border rounded bg-background hover:bg-muted transition-colors"
                        >
                            <FlipHorizontal size={12} />
                            Flip H
                        </button>
                        <button
                            onClick={() => {
                                const currentFlipY = activeObject.flipY || false;
                                activeObject.set('flipY', !currentFlipY);
                                canvas?.requestRenderAll();
                                setForceUpdate(prev => prev + 1);
                            }}
                            className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-xs border border-border rounded bg-background hover:bg-muted transition-colors"
                        >
                            <FlipVertical size={12} />
                            Flip V
                        </button>
                    </div>

                    {/* Opacity Control */}
                    <div>
                        <label className="text-xs text-muted-foreground">Opacity</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={Math.round((activeObject.opacity || 1) * 100)}
                                onChange={(e) => {
                                    const opacity = parseInt(e.target.value) / 100;
                                    activeObject.set('opacity', opacity);
                                    canvas?.requestRenderAll();
                                    setForceUpdate(prev => prev + 1);
                                }}
                                className="flex-1"
                            />
                            <span className="text-xs text-muted-foreground w-8 text-right">
                                {Math.round((activeObject.opacity || 1) * 100)}%
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions Section */}
            <div className="border-t border-border pt-4">
                <h3 className="font-semibold text-xs uppercase text-muted-foreground mb-3">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() => {
                            if (activeObject && canvas) {
                                // Center object on canvas
                                const canvasWidth = canvas.getWidth();
                                const canvasHeight = canvas.getHeight();
                                activeObject.set({
                                    left: canvasWidth / 2,
                                    top: canvasHeight / 2,
                                    originX: 'center',
                                    originY: 'center'
                                });
                                canvas.requestRenderAll();
                                setForceUpdate(prev => prev + 1);
                            }
                        }}
                        className="flex items-center justify-center gap-1 px-2 py-1 text-xs border border-border rounded bg-background hover:bg-muted transition-colors"
                    >
                        <Maximize2 size={12} />
                        Center
                    </button>
                    <button
                        onClick={() => {
                            if (activeObject) {
                                // Reset transform properties but preserve scale
                                const currentScaleX = activeObject.scaleX || 1;
                                const currentScaleY = activeObject.scaleY || 1;
                                activeObject.set({
                                    angle: 0,
                                    flipX: false,
                                    flipY: false,
                                    opacity: 1,
                                    scaleX: currentScaleX,
                                    scaleY: currentScaleY
                                });
                                canvas?.requestRenderAll();
                                setForceUpdate(prev => prev + 1);
                            }
                        }}
                        className="flex items-center justify-center gap-1 px-2 py-1 text-xs border border-border rounded bg-background hover:bg-muted transition-colors"
                    >
                        <RotateCw size={12} />
                        Reset
                    </button>
                    <button
                        onClick={() => {
                            if (activeObject && canvas) {
                                // Duplicate object using Fabric.js v6 clone method
                                activeObject.clone().then((cloned: fabric.Object) => {
                                    cloned.set({
                                        left: (activeObject.left || 0) + 20,
                                        top: (activeObject.top || 0) + 20
                                    });
                                    canvas.add(cloned);
                                    canvas.setActiveObject(cloned);
                                    canvas.requestRenderAll();
                                    setForceUpdate(prev => prev + 1);
                                }).catch((error) => {
                                    console.error('Clone failed:', error);
                                });
                            }
                        }}
                        className="flex items-center justify-center gap-1 px-2 py-1 text-xs border border-border rounded bg-background hover:bg-muted transition-colors"
                    >
                        Copy
                    </button>
                    <button
                        onClick={() => {
                            if (activeObject && canvas) {
                                // Delete object
                                canvas.remove(activeObject);
                                canvas.discardActiveObject();
                                canvas.requestRenderAll();
                                setForceUpdate(prev => prev + 1);
                            }
                        }}
                        className="flex items-center justify-center gap-1 px-2 py-1 text-xs border border-red-500 text-red-500 rounded bg-background hover:bg-red-50 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>

            {/* Color Picker Section */}
            <div className="border-t border-border pt-4">
                <h3 className="font-semibold text-xs uppercase text-muted-foreground mb-3 flex items-center gap-2">
                    <Palette size={12} />
                    Color & Gradient
                </h3>
                
                {/* Mode Toggle */}
                <div className="flex items-center gap-2 mb-3">
                    <button
                        onClick={() => setIsGradientMode(false)}
                        className={`px-3 py-1 text-xs rounded transition-colors border ${
                            !isGradientMode 
                                ? 'bg-primary text-primary-foreground border-primary' 
                                : 'bg-background text-foreground border-border hover:bg-muted'
                        }`}
                    >
                        Solid Color
                    </button>
                    <button
                        onClick={() => setIsGradientMode(true)}
                        className={`px-3 py-1 text-xs rounded transition-colors border ${
                            isGradientMode 
                                ? 'bg-primary text-primary-foreground border-primary' 
                                : 'bg-background text-foreground border-border hover:bg-muted'
                        }`}
                    >
                        Gradient
                    </button>
                </div>

                {!isGradientMode ? (
                    <>
                        {/* Solid Color Grid */}
                        <div className="grid grid-cols-4 gap-2 mb-3">
                            {colorOptions.map((color) => (
                                <button
                                    key={color}
                                    onClick={() => handleColorChange(color)}
                                    className="w-8 h-8 rounded-md border-2 border-border hover:border-primary transition-colors relative group"
                                    style={{ backgroundColor: color }}
                                    title={color}
                                >
                                    {color === '#FFFFFF' && (
                                        <div className="absolute inset-0 rounded-md border border-gray-300" />
                                    )}
                                    <div className="absolute inset-0 rounded-md bg-black/0 group-hover:bg-black/10 transition-colors" />
                                </button>
                            ))}
                        </div>

                        {/* Enhanced Color Code Input */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={selectedColor}
                                    onChange={(e) => handleColorChange(e.target.value)}
                                    className="w-8 h-8 rounded border border-border cursor-pointer"
                                    title="Custom color"
                                />
                                <input
                                    type="text"
                                    value={selectedColor}
                                    onChange={(e) => {
                                        const color = e.target.value;
                                        setSelectedColor(color);
                                        handleColorCodeInput(color);
                                    }}
                                    placeholder="#000000, rgb(255,0,0), hsl(0,100%,50%)"
                                    className="flex-1 px-2 py-1 text-xs border border-border rounded bg-background"
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Supports: HEX, RGB, RGBA, HSL, HSLA
                            </p>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Gradient Presets */}
                        <div className="grid grid-cols-2 gap-2 mb-3">
                            {gradientPresets.map((preset) => (
                                <button
                                    key={preset.name}
                                    onClick={() => handleGradientChange(preset.colors, preset.angle)}
                                    className="h-8 rounded-md border-2 border-border hover:border-primary transition-colors relative group"
                                    style={{
                                        background: `linear-gradient(${preset.angle}deg, ${preset.colors[0]}, ${preset.colors[1]})`
                                    }}
                                    title={preset.name}
                                >
                                    <div className="absolute inset-0 rounded-md bg-black/0 group-hover:bg-black/10 transition-colors" />
                                </button>
                            ))}
                        </div>

                        {/* Custom Gradient Controls */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={gradientPresets[0].colors[0]}
                                    onChange={(e) => {
                                        const newColors = [e.target.value, gradientPresets[0].colors[1]];
                                        handleGradientChange(newColors, gradientAngle);
                                    }}
                                    className="w-8 h-8 rounded border border-border cursor-pointer"
                                    title="Start color"
                                />
                                <span className="text-xs text-muted-foreground">→</span>
                                <input
                                    type="color"
                                    value={gradientPresets[0].colors[1]}
                                    onChange={(e) => {
                                        const newColors = [gradientPresets[0].colors[0], e.target.value];
                                        handleGradientChange(newColors, gradientAngle);
                                    }}
                                    className="w-8 h-8 rounded border border-border cursor-pointer"
                                    title="End color"
                                />
                                <input
                                    type="range"
                                    min="0"
                                    max="360"
                                    value={gradientAngle}
                                    onChange={(e) => {
                                        const angle = parseInt(e.target.value);
                                        setGradientAngle(angle);
                                        handleGradientChange(gradientPresets[0].colors, angle);
                                    }}
                                    className="flex-1"
                                />
                                <span className="text-xs text-muted-foreground w-8">{gradientAngle}°</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Adjust angle: 0° = right, 90° = down, 180° = left, 270° = up
                            </p>
                        </div>
                    </>
                )}
            </div>

                    </div>
    );
}
