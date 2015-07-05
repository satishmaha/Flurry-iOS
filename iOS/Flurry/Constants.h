//
//  Constants.h
//  Flurry
//
//  Created by Satish on 5/7/15.
//  Copyright (c) 2015 Satish Maha Software. All rights reserved.
//

#define RandBell(scale) (scale * (1.0f - (rand() + rand() + rand()) / ((float) RAND_MAX * 1.5f)))

#define incohesion 0.07f
#define colorIncoherence 0.15f
#define streamSpeed 45.0 //original at 450
#define fieldCoherence 0
#define fieldSpeed 12.0f
#define seraphDistance 200.0f
#define streamSize 15000.0f
#define fieldRange 100.0f
#define streamBias 7.0f
#define streamExpansion 100

#define gravity 1500000.0f

#define NUMSMOKEPARTICLES 2500
