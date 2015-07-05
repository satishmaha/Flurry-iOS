//
//  GameViewController.h
//  Flurry
//
//  Created by Satish on 5/1/15.
//  Copyright (c) 2015 Satish Maha Software. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <GLKit/GLKit.h>

//enum
//{
//    UNIFORM_MODELVIEWPROJECTION_MATRIX,
//    UNIFORM_NORMAL_MATRIX,
//    NUM_UNIFORMS
//};
//GLint uniforms[NUM_UNIFORMS];

@interface GameViewController : GLKViewController

{
    double _oldFrameTime;
}

@end
