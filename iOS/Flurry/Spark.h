//
//  Spark.h
//  Flurry
//
//  Created by Satish on 5/6/15.
//  Copyright (c) 2015 Satish Maha Software. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreGraphics/CoreGraphics.h>

@interface Spark : NSObject

{
@public
    float oldPos[3];
    float pos[3];
    int mystery;
    float deltaPos[3];
    float color[3];
}

- (instancetype)initWithSparkAmount:(NSInteger)sparkAmount;

- (void)updateSpark;

@end
