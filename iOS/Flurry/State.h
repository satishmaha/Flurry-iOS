//
//  State.h
//  Flurry
//
//  Created by Satish on 5/7/15.
//  Copyright (c) 2015 Satish Maha Software. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreGraphics/CoreGraphics.h>

#import "FlurrySmoke.h"
#import "Spark.h"
#import "Star.h"

typedef NS_ENUM(NSInteger, ColorModes)
{
    redColorMode = 0,
    magentaColorMode,
    blueColorMode,
    cyanColorMode,
    greenColorMode,
    yellowColorMode,
    slowCyclicColorMode,
    cyclicColorMode,
    tiedyeColorMode,
    rainbowColorMode,
    whiteColorMode,
    multiColorMode,
    darkColorMode
};

@interface State : NSObject
{
    @public
    Spark *spark[32];
}

@property (nonatomic, strong) FlurrySmoke *smoke;
@property (nonatomic, strong) Star *star;

@property (nonatomic, assign) NSInteger numOfStreams;
@property (nonatomic, assign) CGFloat time;
@property (nonatomic, assign) CGFloat drag;
@property (nonatomic, assign) NSInteger frame;
@property (nonatomic, assign) CGFloat deltaTime;
@property (nonatomic, assign) CGFloat oldFrameTime;
@property (nonatomic, assign) CGFloat oldTime;
@property (nonatomic, assign) CGFloat randSeed;

@property (nonatomic, assign) CGFloat screenWidth;
@property (nonatomic, assign) CGFloat screenHeight;
@property (nonatomic, assign) ColorModes currentColorMode;


+ (State *)sharedState;

@end
