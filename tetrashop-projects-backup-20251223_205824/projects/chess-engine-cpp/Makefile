CXX = g++
CXXFLAGS = -std=c++11 -O2 -Wall
TARGET = chess-engine

SRC_FILES = $(wildcard *.cpp)
OBJ_FILES = $(SRC_FILES:.cpp=.o)

all: $(TARGET)

$(TARGET): $(OBJ_FILES)
$(CXX) $(CXXFLAGS) -o $@ $^

%.o: %.cpp
$(CXX) $(CXXFLAGS) -c $< -o $@

clean:
rm -f *.o $(TARGET)

run: $(TARGET)
./$(TARGET)

.PHONY: all clean run
